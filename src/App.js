import { loadingRequest } from './Api.js';
import Files from './Files.js';
import ImageViewer from './ImageViewer.js';
import LoadingModal from './LoadingModal.js';
import DirectoryTree from './DirectoryTree.js';

const cache = {};
//[id]에 files를 넣을거임.

export default function App($app) {
  this.state = {
    isLoading: false,
    isRoot: false,
    directoryTree: ['root'],
    files: [],
    fileShowing: '',
  };

  const imageViewer = new ImageViewer({
    $app,
    initialState: { fileShowing: '' },
  });

  const loadingModal = new LoadingModal({
    $app,
    initialState: { isLoading: true },
  });

  // this.onClick(directoryId, parseInt(index));
  const directoryTree = new DirectoryTree({
    $app,
    initialState: { directoryTree: ['root'] },
    onClick: (directoryId, index) => {
      if (directoryId === 'root') {
        const nextState = {
          isLoading: false,
          directoryTree: ['root'],
          files: cache.root,
          fileShowing: '',
          isRoot: true,
        };
        this.setState(nextState);
        return;
      }
      const directoryLength = this.state.directoryTree.length;
      if (index === directoryLength - 1) return;
      //parentDirectory를 잘라야 하고,
      const directoryTree = this.state.directoryTree.slice(0, index + 1);
      const files = cache[directoryId];
      const nextState = {
        isLoading: false,
        directoryTree,
        files,
        fileShowing: '',
        isRoot: false,
      };
      this.setState(nextState);
    },
  });

  const files = new Files({
    $app,
    initialState: {
      files: [],
    },
    //this.onClick({ fileId, type })
    // type 'file' or 'directory'
    onClick: async ({ fileId, type }) => {
      const file = this.state.files.find((file) => file.id === fileId);
      if (type === 'file') {
        const nextState = {
          ...this.state,
          fileShowing: file.filePath,
        };
        this.setState(nextState);
        return;
      }

      if (type === 'directory') {
        let nextState;
        let files;
        const directoryTree = this.state.directoryTree;

        if (cache[fileId]) {
          files = cache[fileId];
        } else {
          files = await loadingRequest({
            setLoading: () => {
              loadingModal.setState({ isLoading: true });
            },
            finishLoading: () => {
              loadingModal.setState({ isLoading: false });
            },
            dirId: fileId,
          });
          cache[fileId] = files;
        }

        directoryTree.push(file);
        nextState = {
          ...this.state,
          isRoot: false,
          files,
          directoryTree,
        };

        this.setState(nextState);
        return;
      }
    },
    //this.onBackClick();
    onBackClick: () => {
      const directoryTree = this.state.directoryTree;
      directoryTree.pop();
      const curDirectory = directoryTree.slice(-1)[0];
      const files =
        curDirectory === 'root' ? cache.root : cache[curDirectory.id];
      const isRoot = curDirectory === 'root';

      const nextState = {
        ...this.state,
        isRoot,
        files,
        directoryTree,
      };

      this.setState(nextState);
    },
  });

  this.setState = (nextState) => {
    this.state = { ...this.state, ...nextState };
    imageViewer.setState({ fileShowing: this.state.fileShowing });
    loadingModal.setState({ isLoading: this.state.isLoading });
    directoryTree.setState({
      directoryTree: this.state.directoryTree,
    });
    files.setState({ isRoot: this.state.isRoot, files: this.state.files });
  };

  this.init = async () => {
    // 처음에 cache에
    const rootFiles = await loadingRequest({
      setLoading: () => {
        loadingModal.setState({ isLoading: true });
      },
      finishLoading: () => {
        loadingModal.setState({ isLoading: false });
      },
      dirId: 0,
    });

    cache.root = rootFiles;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.setState({ ...this.state, fileShowing: '' });
      }
    });
    $app.addEventListener('click', (e) => {
      if (e.target.nodeName === 'DIV') {
        this.setState({ ...this.state, fileShowing: '' });
      }
    });

    this.setState({
      isLoading: false,
      isRoot: true,
      parentDirectory: ['root'],
      files: rootFiles,
      fileShowing: '',
    });
  };

  this.init();
}

// loading을 쓰는 애 하나,
// File을 보여줄 애 하나, is Root를 들고 갈듯?
// directories를 보여줄 애 하나

// directories 나오고, files 나와야 함. 그전에 로딩 모달이랑, 이미지 뷰어가 나와야 할듯;

// files의 onclick은 {fileId, type}을 받음 type은 'file' or 'directory'

// loading Modal은 isLoading만 들고 오면 됨.

/**
 * 
{ 
  response : 
  [
    {
        "id": "5",
        "name": "2021/04",
        "type": "DIRECTORY",
        "filePath": null,
        "parent": {
            "id": "1"
        }
    },
    {
        "id": "19",
        "name": "물 마시는 사진",
        "type": "FILE",
        "filePath": "/images/a2i.jpg",
        "parent": {
            "id": "1"
        }
    }
  ]
}
 */
