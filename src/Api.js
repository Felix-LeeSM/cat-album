const fileBaseUrl =
  'https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev';

const getFiles = async (dirId) => {
  try {
    const url = dirId ? `${fileBaseUrl}/${dirId}` : fileBaseUrl;
    const response = await fetch(url);
    if (!response.ok) throw new Error('server Error');

    return await response.json();
  } catch (err) {
    throw new Error('internal Error', err);
  }
};

export const loadingRequest = async ({ setLoading, finishLoading, dirId }) => {
  try {
    setLoading();
    return await getFiles(dirId);
  } catch (err) {
    throw new Error('loading Request Error');
  } finally {
    finishLoading();
  }
};
