<template>
  <div class="i-layer-model" v-show="tree && tree.length>0">
    <transition-group name="fade">
      <div class="layer" :class="{'show-layer': comKey === tree.length - 1}" @click.stop.self="popFn" :style="{zIndex: 1000 + comKey}" v-for="(com, comKey) in tree" :key="comKey">
        <component class="model-one" :data-type="com.type" :is="com.name" :params="clone(com.params)" :style="com.style ? com.style : {}" :key="comKey"/>
      </div>
    </transition-group>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Helper from '@/lib'
import _ from 'lodash'
export default {
  components: {
    ...Helper.requireAll(require.context(`./child`, true, /\.vue$/)),
  },
  data() {
    return {
      basicData: {},
      showAnimate: {
        classes: 'fadeIn',
        duration: 400,
      },
    }
  },
  computed: {
    ...mapState('layermodel', ['tree']),
    range() {
      return this.tree && this.tree.length > 0 ? this.firstUpperCase(this.tree[this.tree.length - 1].type) : ''
    },
    curentPage() {
      return this.tree[this.tree.length - 1]
    },
  },
  created() {
    this.$Helper.onAction('closeModel', () => {
      this.closeModel()
    })
  },
  watch: {
    tree() {
      this.showAnimate.classes = `fadeIn${this.range}`
    },
    '$route'() {
      this.$store.dispatch('layermodel/close')
    },
  },
  methods: {
    closeModel() {
      this.$store.dispatch('layermodel/pop')
    },
    popFn() {
      if (this.curentPage.locked) return
      this.$store.dispatch('layermodel/pop')
    },
    clone(params) {
      return _.cloneDeep(params)
    },
    firstUpperCase(str) {
      return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.i-layer-model {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .layer {
    z-index: 1000;
    background: rgba(0, 0, 0, 0.1);
    transition: all 400ms linear;
    &.show-layer{
      background: rgba(0, 0, 0, 0.3);
    }
  }
  .model-one{
    // background: white;
    position: absolute;
    height: auto;
    -webkit-animation-duration: 0.4s;
    animation-duration: 0.4s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    &[data-type="right"] {
      right: 0;
      top: 0;
      bottom: 0;
      -webkit-animation-name: fadeInRight;
      animation-name: fadeInRight;
    }
    &[data-type="left"] {
      left: 0;
      top: 0;
      bottom: 0;
      -webkit-animation-name: fadeInLeft;
      animation-name: fadeInLeft;
    }
    &[data-type="up"] {
      right: 0;
      left: 0;
      bottom: 0;
      -webkit-animation-name: fadeInUp;
      animation-name: fadeInUp;
    }
    &[data-type="down"] {
      right: 0;
      left: 0;
      top: 0;
      -webkit-animation-name: fadeInDown;
      animation-name: fadeInDown;
    }
  }
}
@-webkit-keyframes fadeInLeft {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@-webkit-keyframes fadeInRight {
  from {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@-webkit-keyframes fadeInUp {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@-webkit-keyframes fadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
</style>
