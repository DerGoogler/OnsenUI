<template>
  <v-ons-page>
    <v-ons-navigator swipeable :page-stack="pageStack" :pop-page="popPage"></v-ons-navigator>
  </v-ons-page>
</template>

<script>
  import { markRaw } from 'vue';
  import { defineStore, mapActions, mapState } from 'pinia';

  const usePageStackStore = defineStore('pageStack', {
    state: () => ({ pageStack: [] }),
    actions: {
      pushPage(page) {
        if (page instanceof Array) {
          this.pageStack.push(...page.map(markRaw))
        } else {
          this.pageStack.push(markRaw(page));
        }
      },
      popPage() {
        if (this.pageStack.length > 1) {
          this.pageStack.pop();
        }
      },
      replacePage(page) {
        this.pageStack.pop();
        this.pageStack.push(page);
      },
      resetPageStack() {
        this.pageStack = [this.pageStack[0]];
      }
    }
  });

  const myToolbar = {
    template: `
      <v-ons-toolbar>
        <div class="left"><v-ons-back-button>Back</v-ons-back-button></div>,
        <div class="center"><slot></slot></div>
      </v-ons-toolbar>
    `
  };

  const page3 = {
    template: `
      <v-ons-page p3>
        <my-toolbar>Page 3</my-toolbar>
        Page 3
        <v-ons-button @click="replace">Replace with first page</v-ons-button>
        <v-ons-button @click="resetPageStack">Reset to first page</v-ons-button>
      </v-ons-page>
    `,
    methods: {
      ...mapActions(usePageStackStore, ['replacePage', 'resetPageStack']),
      replace() {
        this.replacePage(page1);
      }
    },
    components: { myToolbar }
  };

  const page2 = {
    template: `
      <v-ons-page p2>
        <my-toolbar>Page 2</my-toolbar>
        Page 2
        <v-ons-button @click="push">Push 3 pages</v-ons-button>
      </v-ons-page>
    `,
    methods: {
      ...mapActions(usePageStackStore, ['pushPage']),
      push() {
        this.pushPage([page3, page3, page3]);
      }
    },
    components: { myToolbar }
  };

  const page1 = {
    template: `
      <v-ons-page p1>
        <my-toolbar>Page 1</my-toolbar>
        Page 1
        <v-ons-button @click="push">Push</v-ons-button>
      </v-ons-page>
    `,
    methods: {
      ...mapActions(usePageStackStore, ['pushPage']),
      push() {
        this.pushPage(page2);
      }
    },
    components: { myToolbar }
  };

	export default {
    computed: {
      ...mapState(usePageStackStore, ['pageStack'])
    },
    beforeMount() {
      this.pushPage(page1);
    },
    methods: {
      ...mapActions(usePageStackStore, ['pushPage', 'popPage', 'replacePage', 'resetPageStack']),
    }
	};
</script>
