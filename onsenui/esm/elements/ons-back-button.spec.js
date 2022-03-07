'use strict';

describe('OnsBackButtonElement', () => {
  it('exists', () => {
    expect(window.ons.elements.BackButton).to.be.ok;
  });

  describe('class attribute', () => {
    it('should contain "back-button" class name automatically', () => {
      const element = new ons.elements.BackButton();
      element.setAttribute('class', 'foobar');
      expect(element.classList.contains('back-button')).to.be.ok;
      expect(element.classList.contains('foobar')).to.be.ok;
    });
  });

  it('provides \'modifier\' attribute', () => {
    const element = ons._util.createElement('<ons-back-button>label</ons-back-button>');

    element.setAttribute('modifier', 'hoge');
    expect(element.classList.contains('back-button--hoge')).to.be.true;

    element.setAttribute('modifier', 'foo bar');
    expect(element.classList.contains('back-button--foo')).to.be.true;
    expect(element.classList.contains('back-button--bar')).to.be.true;
    expect(element.classList.contains('back-button--hoge')).not.to.be.true;

    element.classList.add('back-button--piyo');
    element.setAttribute('modifier', 'fuga');
    expect(element.classList.contains('back-button--piyo')).to.be.true;
    expect(element.classList.contains('back-button--fuga')).to.be.true;
  });

  it('has two children', () => {
    const element = ons._util.createElement('<ons-back-button>label</ons-back-button>');
    document.body.appendChild(element);

    expect(element.children[0]).to.be.ok;
    expect(element.children[1]).to.be.ok;
    expect(element.children[2]).not.to.be.ok;
  });

  describe('#_onClick()', () => {
    let div, nav;

    beforeEach((done) => {
      div = ons._util.createElement(`
        <div>
          <template id="page1">
            <ons-page id="p1">page1 content</ons-page>
          </template>
          <template id="page2">
            <ons-page id="p2">
              <ons-back-button>content</ons-back-button>
            </ons-page>
          </template>
        </div>
      `);

      nav = new ons.elements.Navigator();
      nav._options = {cancelIfRunning: false};
      document.body.appendChild(div);
      document.body.appendChild(nav);
      nav.pushPage('page1').then(function(e) {
        done();
      });
    });

    afterEach(() => {
      div.remove();
      nav.remove();
      div = nav = null;
    });

    it('will pop a page', () => {
      const promise = new Promise((resolve) => {
        nav.addEventListener('postpop', () => {
          resolve();
        });

        nav.pushPage('page2').then(function(page) {
          const element = nav.querySelector('ons-back-button');
          const event = new Event('click');
          nav.querySelector('ons-back-button')._onClick(event);
        });
      });

      return expect(promise).to.eventually.be.fulfilled;
    });
  });

  describe('#onClick', () => {
    it('adds an event listener when set while the back button is already connected', () => {
      const backButton = ons._util.createElement('<ons-back-button></ons-back-button>');
      document.body.appendChild(backButton);
      backButton.onClick = () => {};
      const spy = chai.spy.on(backButton, 'onClick');
      backButton.dispatchEvent(new Event('click'));
      expect(spy).to.have.been.called.once;
      backButton.remove();
    });

    it('does not add an event listener when set while the back button is not already connected', () => {
      const backButton = ons._util.createElement('<ons-back-button></ons-back-button>');
      backButton.onClick = () => {};
      const spy = chai.spy.on(backButton, 'onClick');
      backButton.dispatchEvent(new Event('click'));
      expect(spy).not.to.have.been.called;
    });

    it('removes the previous event listener when onClick is set again', () => {
      const backButton = ons._util.createElement('<ons-back-button></ons-back-button>');
      document.body.appendChild(backButton);
      backButton.onClick = assert.fail;
      backButton.onClick = () => {};
      backButton.dispatchEvent(new Event('click'));
      backButton.remove();
    });

    it('adds the event listener when the back button is connected', () => {
      const backButton = ons._util.createElement('<ons-back-button></ons-back-button>');
      backButton.onClick = () => {};
      const spy = chai.spy.on(backButton, 'onClick');
      document.body.appendChild(backButton);
      backButton.dispatchEvent(new Event('click'));
      expect(spy).to.have.been.called.once;
      backButton.remove();
    });

    it('removes the event listener when the back button is disconnected', () => {
      const backButton = ons._util.createElement('<ons-back-button></ons-back-button>');
      document.body.appendChild(backButton);
      backButton.onClick = assert.fail;
      backButton.remove();
      backButton.dispatchEvent(new Event('click'));
    });
  });

  describe('#_compile()', () => {
    it('does not compile twice', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      div1.innerHTML = '<ons-back-button>Back</ons-back-button>';
      div2.innerHTML = div1.innerHTML;
      expect(div1.isEqualNode(div2)).to.be.true;
    });
  });

  describe('autoStyling', () => {
    it('adds \'material\' modifiers and effects on Android', () => {
      ons.platform.select('android');
      const e = ons._util.createElement('<ons-back-button>label</ons-back-button>');
      expect(e.getAttribute('modifier')).to.equal('material');
      ons.platform.select('');
    });
  });
});
