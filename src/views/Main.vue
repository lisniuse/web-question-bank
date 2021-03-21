<template>
  <div class="page">
    <div class="card">
      <div class="loadding" v-if="isLoading">题目加载中...</div>
      <div class="category">
        <span class="category-name">随机出题器 / {{current.category}}</span>
        <a class="switch" href="javascript:void(0);" @click="handleRandom">换一换</a>
      </div>
      <h1 class="title">{{current.title}}</h1>
      <div class="html-content" ref="content" v-html="current.content"></div>
      <div class="footer">
        <a href="https://github.com/lisniuse/web-question-bank">GitHub</a>
        <a href="https://github.com/lisniuse/web-question-bank#打赏作者">打赏作者</a>
      </div>
    </div>
  </div>
</template>

<script>
const packageJson = require('../../package.json');

import hljs from 'highlight.js'
import 'highlight.js/styles/atelier-sulphurpool-light.css'

import request from '@/common/request'
import { parseMarkdown } from '@/common/utils'
import config from '@/config'

export default {
  name: 'Main',
  data() {
    return {
      isLoading: true,
      current: {
        id: 1,
        category: '',
        title: '',
        content: ''
      },
      questions: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * 初始化
     */
    async init() {
      // 异步加载题目
      await this.loadQuestions()
      // 获取当前题目或者随机题目
      this.initQuestion()
      // 取消加载状态
      this.isLoading = false
    },
    /**
     * 加载题目
     */
    async loadQuestions() {
      for (const item of config) {
        const res = await request.get(`/${packageJson.name}/markdown/${item.path}.md`)
        const questions = parseMarkdown(res.data, item)
        this.questions.push.apply(this.questions, questions)
      }
    },
    /**
     * 点击换一换
     */
    handleRandom() {
      this.initQuestion(true);
    },
    /**
     * 当前题目初始化
     */
    initQuestion(isRandom = false) {
      this.current = isRandom ? this.getQuestionByRandom() : (this.getQuestionByUrl() || this.getQuestionByRandom())
      this.switchRouter();
      this.highlight();
    },
    /**
     * 通过路由ID的获取题目
     */
    getQuestionByUrl() {
      const { id } = this.$route.query;
      if (!id) return;
      const currentId = id.split('_').join('/');
      const findItem = this.questions.find(item => item.id === currentId)
      return findItem;
    },
    /**
     * 随机获取一道题目
     */
    getQuestionByRandom() {
      const index = Math.floor((Math.random()*this.questions.length))
      return this.questions[index]
    },
    /**
     * 路由切换
     */
    switchRouter() {
      const { name, query } = this.$route
      const id = this.current.id.split('/').join('_')
      if (!(name === 'Main' && query.id === id)) {
        this.$router.push({ name: 'Main', query: { id } })
      }
    },
    /**
     * 代码高亮
     */
    highlight() {
      this.$nextTick(() => {
        this.$refs.content.querySelectorAll('pre code')
          .forEach(block => hljs.highlightBlock(block))
      })
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  position: relative;
  margin: 0 auto;
  width: 900px;
  font-size: 16px;
  padding: 0 18px 18px 18px;

  a {
    color: #1b73e7;
  }
  
  .category {
    padding: 32px 0 32px 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f4f4f4;
    font-size: 14px;

    .category-name {
      color: gray;
    }
  }

  .title {
    padding: 20px 0 20px 0;
    font-size: 22px;
    font-weight: bold;
  }

  .footer {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f4f4f4;
    a {
      font-size: 16px;
      margin-right: 10px;
      text-decoration: underline;
    }
  }

  .loadding {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 16px;
    text-align: center;
    padding-top: 100px;
    background-color: #fff;
  }
}

@media screen and (max-width: 900px) {
  .card {
    width: 100%;

    .category {
      border-color: #ebebeb;
    }

    .title {
      padding: 10px 0 10px 0;
    }
  }
}
</style>
