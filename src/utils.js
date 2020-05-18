export const bgColorArr = [
  '#caad9f',
  '#f0c869',
  '#6abce0',
  '#9ac4bd',
  '#fad0c4',
  '#9ec6cd'
]

export const sources = {
  O: require('./assets/images/O.png'),
  R: require('./assets/images/R.png'),
  Ob: require('./assets/images/Ob.png')
}

export const downloadImage = (imgUrl) => {
  const a = document.createElement('a');
  a.href = imgUrl;
  a.download = 'oreo.png';
  a.dispatchEvent(new MouseEvent('click', {}));
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const showImage = (imgUrl) => {
  window.open(imgUrl);
}

export const isIOS = () => {
  const u = window.navigator.userAgent;
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  return isiOS;
}

export const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}