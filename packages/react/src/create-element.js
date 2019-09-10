import React, {forwardRef} from 'react'

import {useMDXComponents} from './context'

const TYPE_PROP_NAME = 'mdxType'

const DEFAULTS = {
  inlineCode: 'code',
  wrapper: ({children}) => React.createElement(React.Fragment, {}, children)
}

const MDXCreateElement = forwardRef((props, ref) => {
  const {mdxType, mdxComponents, originalType, parentName, ...etc} = props

  const components = useMDXComponents(mdxComponents)
  const type = mdxType
  const Component =
    components[`${parentName}.${type}`] ||
    components[type] ||
    DEFAULTS[type] ||
    originalType

  if (mdxComponents) {
    return React.createElement(Component, {ref, mdxComponents, ...etc})
  }

  return React.createElement(Component, {ref, ...etc})
})

MDXCreateElement.displayName = 'MDXCreateElement'

export default function(type, props) {
  const args = arguments
  const mdxType = props && props.mdxType

  if (typeof type === 'string' || mdxType) {
    const argsLength = args.length

    const createElementArgArray = new Array(argsLength)
    createElementArgArray[0] = MDXCreateElement

    const newProps = {}
    for (let key in props) {
      if (hasOwnProperty.call(props, key)) {
        newProps[key] = props[key]
      }
    }

    newProps.originalType = type
    newProps[TYPE_PROP_NAME] = typeof type === 'string' ? type : mdxType

    createElementArgArray[1] = newProps

    for (let i = 2; i < argsLength; i++) {
      createElementArgArray[i] = args[i]
    }

    return React.createElement.apply(null, createElementArgArray)
  }

  return React.createElement.apply(null, args)
}
