const imageBaseUrl =
  'https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public';

export default function ImageViewer({ $app, initialState }) {
  this.state = initialState;
  this.$target = document.createElement('div');
  this.$target.className = 'Modal ImageViewer';
  $app.append(this.$target);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    const fileShowing = this.state.fileShowing;
    if (fileShowing) {
      const template = `
      <div>
        <img src="${imageBaseUrl}${fileShowing}">
      </div>
      `;
      this.$target.innerHTML = template;
      this.$target.style.display = 'block';
      return;
    }
    this.$target.style.display = 'none';
  };

  this.render();
}
