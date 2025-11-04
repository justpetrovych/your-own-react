import { isEvent, isStyle, isProperty, isNew, isGone } from "./helpers";

export const updateDom = (dom, prevProps, nextProps) => {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(
        eventType,
        prevProps[name]
      );
    });

  // Remove old or changed styles
  if (prevProps.style) {
    const prevStyle = typeof prevProps.style === "object" ? prevProps.style : {};
    const nextStyle = nextProps.style && typeof nextProps.style === "object" ? nextProps.style : {};

    Object.keys(prevStyle).forEach(styleName => {
      if (!(styleName in nextStyle)) {
        dom.style[styleName] = "";
      }
    });
  }

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = "";
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name];
    });

  // Set new or changed styles
  if (nextProps.style && typeof nextProps.style === "object") {
    const prevStyle = prevProps.style && typeof prevProps.style === "object" ? prevProps.style : {};
    const nextStyle = nextProps.style;

    Object.keys(nextStyle).forEach(styleName => {
      if (prevStyle[styleName] !== nextStyle[styleName]) {
        dom.style[styleName] = nextStyle[styleName];
      }
    });
  }

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(
        eventType,
        nextProps[name]
      );
    });
};

const createTextElement = (text) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
};

export const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children
        .flat()
        .map(child => typeof child === "object" ? child : createTextElement(child)),
    },
  };
};

export const createDom = (fiber) => {
  const domNode =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(domNode, {}, fiber.props);

  return domNode;
};

export const render = (element, container) => {
  window.MyReact.workingRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: window.MyReact.currentRoot,
  };
  window.MyReact.deletions = [];
  window.MyReact.nextUnitOfWork = window.MyReact.workingRoot;
};