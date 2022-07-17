const createTextElement = (text) => ({
  type: "TEXT_ELEMENT",
  props: {
    nodeValue: text,
    children: []
  }
});

export const createElement = (type, props, ...children) => ({
  type,
  props: {
    ...props,
    children: children.map(child =>
      typeof child === "object" ? child : createTextElement(child)
    )
  }
});

export const createNode = (fiber) => {
  console.log('createNode');

  const node = fiber.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(fiber.type);

  const isProperty = key => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(key => {
      node[key] = fiber.props[key];
    });

  return node;
};

export const render = (element, container) => {
  MyReact.nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
};