export default function LoadingModal({ $app, initialState }) {
  // isLoading만 들고 오면 됨.
  this.state = initialState;
  this.$target = document.createElement('div');
  this.$target.className = 'Modal Loading';

  $app.append(this.$target);

  this.render = () => {
    const template = `
    <div class="content">
      <img style="width: 80%;" src="./assets/nyan-cat.gif">
    </div>`;
    this.$target.innerHTML = template;
    this.$target.style.display = this.state.isLoading ? 'block' : 'none';
  };

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render();
}
