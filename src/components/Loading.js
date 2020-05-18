import React, { Fragment } from 'react'
import { CSSTransition } from 'react-transition-group' // 引入过渡动画支持
import './Loading.styl'

const Loading = (props) => {
  const { loading } = props.show // 从props中接收loading显示状态
  return (
    <Fragment>
      {/* 使用CSSTransition包裹实现组件挂载和卸载时的过渡动画 */}
      <CSSTransition
        classNames="bounce" // 动画类名前缀
        in={loading} // loading为true时触发进入动画
        timeout={500} // 动画持续500ms
        unmountOnExit // 动画结束时自动卸载组件
      >
        <div className="content-loading">
          <img className="loading-img" src={require('../assets/images/oreo.png')} alt="loading" />
          <h2>Loading...</h2>
        </div>
      </CSSTransition>
    </Fragment>
  )
}

export default Loading