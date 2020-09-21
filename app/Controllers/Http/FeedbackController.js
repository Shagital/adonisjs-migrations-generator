'use strict'
const Feedback = use("App/Models/Feedback");
const FeedbackEntry = use("App/Models/FeedbackEntry");
const FeedbackMetric = use("App/Models/FeedbackMetric");
const TemplateCache = use("App/Models/TemplateCache");
const Quiz = use("App/Models/Quiz");
const Country = use("App/Models/Country");
const QuizQuestion = use("App/Models/QuizQuestion");
const QuizQuestionOption = use("App/Models/QuestionOption");

const {validateAll} = use("Validator");
const moment = use("moment");
const {random} = use("App/Common/helpers")
const Drive = use("Drive")
const Env = use("Env")
const fileName = 'embed.html'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with feedbacks
 */
class FeedbackController {
  /**
   * Show a list of all feedbacks.
   * GET feedbacks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index ({ auth, request, response }) {
    let user = await auth.getUser();
    let qs = request.get();
    let query = Feedback.query().where('user_id', user.id);

    if(qs.name) {
      query.where('name', 'LIKE', `%${qs.name}%`);
    }
    if(qs.type) {
      query.where('type', qs.type);
    }
    if(qs.feedback_template_id) {
      query.where('feedback_template_id', qs.feedback_template_id);
    }
    if(qs.status) {
      query.where('status', qs.status);
    }
    if(qs.created_at_from) {
      query.where('created_at', '>=', moment(qs.created_at_from).format('YYYY-MM-DD HH:mm:ss'));
    }
    if(qs.created_at_to) {
      query.where('created_at', '<=', moment(qs.created_at_to).format('YYYY-MM-DD HH:mm:ss'));
    }

    if(qs.sort) {
      let split = qs.sort.split('|');
      let orderBy = split[0];
      let order = split[1];
      query.orderBy(orderBy, order);
    } else {
      query.orderBy('id', 'desc');
    }

    let data = await query.with('quiz.questions.options').paginate(qs.page || 1, qs.per_page || 25);

    response.send(data);
  }

  /**
   * Create/save a new feedback.
   * POST feedbacks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
    let user = await auth.getUser();
    let planId = parseInt(user.plan_id);

    if(planId < 4) {
      let feedbacks = await Feedback.query().where('user_id', user.id).getCount();

      if (feedbacks == 1 && planId == 1) {
        return response.status(400).send({message:'You have exceeded your free plan limit. Please upgrade'})
      } else if (feedbacks == 5) {
        return response.status(400).send({message:'You have exceeded the limit of your plan. Please upgrade'})
      }
    }

    const data = request.only(['type', 'name', 'description', 'meta']);
    const rules = {
      type: 'required|in:feedback,poll,survey',
      name: 'required|string',
    };

    switch (data['type']) {
      case 'survey':
        rules['questions'] = 'array';
        data['questions'] = request.input('questions');
        // rules['options'] = 'required|array';
        break;
      case 'poll':
        rules['question'] = 'required';
        data['question'] = request.input('question');
      // rules['options'] = 'required|array';
    }
    const validation = await validateAll(data, rules);

    if (validation.fails()) {
      return response.status(422).send(validation.messages())
    }

    data.meta = data.meta || {
      widget_type_id: 1,
        customizations: {
        tagline_font_size: "17",
          tagline_font_color: "red",
          primary_color: "#000000",
          secondary_color: "#FFFFFF",
          button_text: "Submit Feedback",
          quiz_button_text: "Next",
          tagline: "What do you think about us",
          widget_pos: "bottom-left",
          behavior: "",
          delay: null,
          language: "English",
          trigger: {
          button: "Drop Feedback",
            background: "rgba(90, 67, 157, 0.7)",
            icon_background: "rgba(90, 67, 157, 1)",
            text_color: "#FFFFFF",
            include_icon: true,
            icon: "👋🏻"
        },
        fields: [
          {
            type: "name",
            inview: false,
            fValue: "",
            label: "Enter your name"
          },
          {
            type: "telephone",
            inview: false,
            fValue: "",
            label: "Enter your telephone number"
          },
          {
            type: "email",
            inview: false,
            fValue: "",
            label: "Enter your email"
          },
          {
            type: "message",
            inview: true,
            fValue: "",
            label: "Write your message"
          }
        ],
          success_message: "Feedback sent! You're amazing! 💖",
          active_question: 1
      },
      filters: {
        blocked: {
          country_codes: "",
            region_codes: "",
            city_names: "",
            visitor_type: null,
            device_type: null,
            domain: ""
        },
        allowed: {
          country_codes: "",
            region_codes: "",
            city_names: "",
            visitor_type: null,
            device_type: null,
            domain: ""
        }
      },
      settings :{
          email_address:null,
          track_location: false,
          webhook:null,
      },
    };
    data.status = 2;
    data.template_id = data.type == 'feedback' ? 1 : 2;

    let feedback = await this.createOrUpdate(data, null, user, null);

    response.status(201).send(feedback);
  }

  async createOrUpdate(data, feedback, user, survey) {
    /*
    Filters:
    {
        blocked: {
          country_codes: null, // comma separated Country IDs
          region_codes: null, // comma separated Region state_code
          city_names: null, // | separated City names
          domains: null, // comma separated domains
          visitor_type: null, // null=no filter, 1 = new, 2=returning
          device_type: // null=no filter, 1 = mobile, 2 = noMobile
        },
        allowed: {

        }
      }
     */

    let inputQuestion = data['question'];
    let inputQuestions = data['questions'];

    if (!feedback) {
      feedback = new Feedback();
      feedback.reference = `${user.id}-${random(64)}`;
      feedback.user_id = user.id;
    }

    feedback.type = data.type;
    feedback.name = data.name;
    feedback.description = data.description;
    feedback.template_id = data.template_id || null;
    feedback.user_id = user.id;
    feedback.meta = data.meta;
    feedback.status = data.status;

    await feedback.save();

    if (data['questions'] || data['question']) {
      switch (data.type) {
        case 'survey':
          if(!survey) {
            survey = new Quiz();
            survey.feedback_id = feedback.id;
            survey.name = `${feedback.name} Survey`;
            survey.description = feedback.description;
            await survey.save();
          }

          for (let q of inputQuestions) {
            let question = new QuizQuestion();
            question.content = q.content;
            question.question_type = q.type || 'radio';
            question.quiz_id = survey.id;
            await question.save();

            let awaits = [];
            for (let o of q.answers) {
              let option = new QuizQuestionOption();
              option.quiz_question_id = question.id;
              option.content = o.content;
              awaits.push(option.save());
            }

            await Promise.all(awaits);
          }
          break;
        case 'poll':
          let poll = survey;
          if(!poll) {
            poll = new Quiz();
            poll.feedback_id = feedback.id;
            poll.name = `${feedback.name} Poll`;
            poll.description = feedback.description;
            await poll.save();
          }

          let pollQuestion = inputQuestion;
          let question = new QuizQuestion();
          question.content = pollQuestion.content;
          question.question_type = 'radio';
          question.quiz_id = poll.id;
          await question.save();

          let awaits = [];
          for (let o of pollQuestion.answers) {
            let option = new QuizQuestionOption();
            option.quiz_question_id = question.id;
            option.content = o.content;
            awaits.push(option.save());
          }

          await Promise.all(awaits);
          break;
      }
    }

    feedback.reload();

    return feedback;
  }

  /**
   * Display a single feedback.
   * GET feedbacks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({auth, params, request, response}) {
    let user = await auth.getUser();
    let feedback = await Feedback.query()
      .where({user_id:user.id, id:params.id})
      .with('template').with('quiz.questions.options')
      .firstOrFail();

    let form = await Drive.get(fileName);
    let formString = form.toString();
    let url = `https://api.${Env.get('APP_DOMAIN')}/api/v1/${user.public_key}/${feedback.reference}/embed.js`;
    feedback.embed_code = formString.replace("{{embedUrl}}", url)

    response.send(feedback.toJSON())

  }

  /**
   * Update feedback details.
   * PUT or PATCH feedbacks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ auth, params, request, response }) {
    let user = await auth.getUser();
    const data = request.only(['name', 'description', 'template_id', 'type', 'meta', 'quiz_id']);
    let feedback = await Feedback.query().where({user_id: user.id, id: params.id}).firstOrFail();
    let quiz = null;
    if(data.quiz_id) {
      let quiz = await Quiz.query()
        .whereHas('feedback', (builder) => {
          builder.where('user_id', user.id)
        })
        .where({id: data.quiz_id})
        .firstOrFail();
    }

    const rules = {
      name: 'required|string',
      type: 'required|in:feedback,poll,survey',
      template_id: 'number|exists:templates,id',
    };

    const validation = await validateAll(data, rules)

    if (validation.fails()) {
      return response.status(422).send(validation.messages())
    }

    feedback = await this.createOrUpdate(data, feedback, user, quiz);
    // clear server cache
    await TemplateCache.query().where('reference', feedback.reference).delete();
    response.send(feedback);
  }

  /**
   * Delete a feedback with id.
   * DELETE feedbacks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ auth, params, request, response }) {
    let user = await auth.getUser();
    let feedback = await Feedback.query().where({user_id:user.id, id:params.id}).firstOrFail();
    await feedback.delete();
    response.status(204).send('');
  }

  async SingleMetric({ auth, params, request, response }) {
    let user = await auth.getUser();
    let data = {id: parseInt(params.id)};

    let feedback = await Feedback.query()
      .where({id: params.id, user_id: user.id})
      .with('quiz.questions.options').with('entries.answers')
      .firstOrFail();

    feedback = feedback.toJSON();

    let categories = ['issue', 'inquiry', 'others'];
    let entries = feedback.entries;

    if (feedback.type == 'feedback') {
      data['categories'] = {};

      for (let e of categories) {
        data['categories'][e] = entries.filter((s) => s.category == e).length;
      }
    } else {

      data['questions'] = {};
      let questions = feedback.quiz && feedback.quiz.questions ? feedback.quiz.questions : [];

      for (let question of questions) {
        let total = 0;
        data['questions'][question.id] = {content: question.content, id: question.id, options: {}};

        for (let option of question.options) {

          let count = entries.filter((s) => s.answers.filter((d) => d.question_option_id == option.id).length).length;
          total += count;
          data['questions'][question.id]['options'][option.id] = {
            id: option.id,
            content: option.content,
            count: count,
          }
        }
        data['questions'][question.id]['total'] = total;
      }
    }

    let total = await FeedbackMetric.query().where('feedback_id', feedback.id)
      .with('user')
      .orderBy('id', 'asc')
      .fetch();

    total = total.toJSON();
    let oneYearAgo = moment().subtract(1, 'year').format('YYYY');
    let lastImpressions = total.filter(s => moment(s.created_at).format('MM') == moment().subtract(1, 'month').format('MM')).length;
    let pastYear = total.filter(s => moment(s.created_at).format('YYYY') >= oneYearAgo);
    data.past_year = pastYear.length;
    data.total = total.length;
    data.last_impressions = lastImpressions;
    data.submitted = total.filter(s => !!s.submitted).length;
    data.current_month = total.filter(s => moment(s.created_at).isSame(new Date(), 'month')).length;
    data.countries = {};
    data.browsers = {};
    data.device = {};
    data.months = {};
    for(let item of total) {
      if(item.user && item.user.country_id && !data.countries[item.user.country_id]) {
        let country = await Country.find(item.user.country_id);
        data.countries[item.user.country_id] = {};
        data.countries[item.user.country_id]['country'] = country.toJSON();
        data.countries[item.user.country_id]['count'] = total.filter(s => s.user && s.user.country_id == item.user.country_id).length || 0;
      }

      if(item.user && item.user.browser && !data.browsers[item.user.browser]) {
        data.browsers[item.user.browser] = total.filter(s => s.user && s.user.browser == item.user.browser).length || 0;
      }

      if(!data.device['is_mobile']) {
        data.device['is_mobile'] = total.filter(s => s.user && s.user.is_mobile == item.user.is_mobile).length || 0;
      }

    }

    for (let m of pastYear) {
      let itemMonth = moment(m.created_at).format('YYYY-MM');
      let item = moment(m.created_at).format('MM');
      if(!data.months[itemMonth]) {
        data.months[itemMonth] = total.filter(s => moment(s.created_at).format('MM') == item).length || 0;
      }
    }

    response.send(data);
  }
}

module.exports = FeedbackController
