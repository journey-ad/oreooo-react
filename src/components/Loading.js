import React, { Fragment } from 'react'
import { CSSTransition } from 'react-transition-group'
import './Loading.styl'

const Loading = (props) => {
  const { loading } = props.show
  return (
    <Fragment>
      <CSSTransition
        classNames="bounce"
        in={loading}
        timeout={500}
        unmountOnExit
      >
        <div className="content-loading" v-show="show.loading">
          <img className="loading-img" src={require('../assets/images/oreo.png')} alt="loading" />
          <h2>Loading...</h2>
        </div>
      </CSSTransition>
    </Fragment>
  )
}

export default Loading