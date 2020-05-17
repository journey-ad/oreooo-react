import React, { Fragment } from 'react'
import './Footer.styl'

const languages = {
  中: 'zh_cn',
  En: 'en_us',
  日: 'ja_jp',
  De: 'de_de'
}

const changeLang = (lang) => {
  localStorage.setItem('lang', lang)
  window.location.reload(true);
}

const Footer = (props) => {
  const { loading, output } = props.show
  return (
    <Fragment>
      {
        !loading && !output &&
        <footer className="footer" v-show="!show.loading && !show.output">
          <ul className="lang-list">
            {
              Object.keys(languages).map(lang => {
                return (
                  <li className="lang"
                    onClick={() => { changeLang(languages[lang]) }}
                    key={languages[lang]}
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