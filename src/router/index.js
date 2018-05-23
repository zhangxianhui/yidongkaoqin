import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Theme from '@/components/Theme'
import Sign from '@/components/Sign'
import SignList from '@/components/SignList'
import Rule from '@/components/Rule'

Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/',
      component: Theme,
      children: [{
          path: "",
          redirect: "Sign"
        },
        {
          path: "/Sign",
          name: 'Sign',
          component: Sign,
        },
        {
          path: "/SignList",
          name: 'SignList',
          component: SignList,
        },
        {
          path: "/Rule",
          name: 'Rule',
          component: Rule,
        }
     
      ]
    }
  ]
})
