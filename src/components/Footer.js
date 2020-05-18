import React, { Fragment } from 'react'
import './Footer.styl'

const languages = { // 映射语言名与语言标识
  中: 'zh_cn',
  En: 'en_us',
  日: 'ja_jp',
  De: 'de_de'
}

/**
 * 设置语言标识并刷新页面
 * @param {string} lang 语言标识
 */
const changeLang = (lang) => {
  localStorage.setItem('lang', lang)
  window.location.reload(true);
}

const Footer = (props) => {
  const { loading, output } = props.show // 从props中接收
  return (
    <Fragment>
      {
        !loading && !output && // 非加载中且非输出
        <footer className="footer">
          <ul className="lang-list">
            {
              Object.keys(languages).map(lang => { // 遍历语言映射，渲染切换语言按钮
                return (
                  <li className="lang"
                    onClick={() => { changeLang(languages[lang]) }} // 点击调用changeLang方法，传入对应语言标识
                    key={languages[lang]} // 使用语言标识作为key
                  >{lang}</li>
                )
              })
            }
          </ul>
          <div className="meta">
            <a href="https://imjad.cn" target="_blank">journey-ad</a>
            <a href="https://github.com/journey-ad/oreooo-react" target="_blank">Github</a>
          </div>
        </footer>
      }
    </Fragment >
  )
}

export default Footer