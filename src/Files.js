// files의 state는
// isRoot 가져가야 하고,
// files를 가져가야 하고,
export default function Files({ $app, initialState, onClick, onBackClick }) {
  this.state = initialState;
  this.onClick = onClick;
  this.onBackClick = onBackClick;
  this.$target = document.createElement('div');
  this.$target.className = 'Nodes';
  $app.append(this.$target);

  this.render = () => {
    const files = this.state.files;
    const isRoot = this.state.isRoot;

    const backButtonTemplate = isRoot
      ? ``
      : `
    <div class="Node">
      <img src="./assets/prev.png" />
    </div>
    `;
    const filesTemplate = `
    <div class="Nodes">
    ${backButtonTemplate}
    ${files
      .map((file) => {
        if (file.type === 'DIRECTORY') {
          return `
          <div class="Node" data-file-id="${file.id}" data-type="directory">
          <img src="./assets/directory.png" />
          <div>${file.name}</div>
          </div>`;
        } // 클릭을 했을 떄 뭐가 클릭 되었는 지 알아야함.
        if (file.type === 'FILE') {
          return `
          <div class="Node" data-file-id="${file.id}" data-type="file" >
          <img src="./assets/file.png" />
          <div>${file.name}</div>
          </div>`;
        }
      })
      .join('')}
      </div>
      `;

    this.$target.innerHTML = filesTemplate;
    // 큰 틀을 만들어야 하고, 그 사이에 각 파일들에 대한 것들이 들어가야함.
  };

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.$target.addEventListener('click', (e) => {
    try {
      const target = e.target.closest('.Node');
      if (target) {
        const { fileId, type } = target.dataset;
        if (fileId && type) {
          this.onClick({ fileId, type }); // id, file or directory
        } else {
          this.onBackClick();
        }
      }
    } catch (err) {
      console.error('files', err);
    }
  });

  this.render();
}

/**
 * 
 * 
 * <div class="Node">
 <img src="./assets/prev.png" />
 </div>
 <div class="Node">
 <img src="./assets/directory.png" />
 <div>2021/04</div>
 </div>
 <div class="Node">
          <img src="./assets/file.png" />
          <div>하품하는 사진</div>
        </div>
 */
