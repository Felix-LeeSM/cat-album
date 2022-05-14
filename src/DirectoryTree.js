export default function DirectoryTree({ $app, initialState, onClick }) {
  this.state = initialState;
  this.onClick = onClick;
  this.$target = document.createElement('nav');
  this.$target.className = 'Breadcrumb';
  $app.append(this.$target);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    const directoryTree = this.state.directoryTree;
    const template = `
    ${directoryTree
      .map((directory, index) => {
        if (directory === 'root') {
          return `
        <div class="directory" data-directory-id="root" data-index="${index}">root</div>
        `;
        }
        return `
      <div class="directory" data-directory-id="${directory.id}" data-index="${index}">${directory.name}</div>
      `;
      })
      .join('')}
      `;
    this.$target.innerHTML = template;
  };

  this.$target.addEventListener('click', (e) => {
    try {
      const target = e.target.closest('.directory');
      if (target) {
        const { directoryId, index } = target.dataset;
        if (directoryId) {
          this.onClick(directoryId, parseInt(index));
        }
      }
    } catch (err) {
      console.error('directory Tree', err);
    }
  });

  this.render();
}
/**
 * <nav class="Breadcrumb">
        <div>root</div>
        <div>노란고양이</div>
      </nav>
 */
