import MyReact from '../index';

describe('MyReact', () => {
  beforeEach(() => {
    // Reset the DOM
    document.body.innerHTML = '';
    // Reset MyReact global state
    window.MyReact = {
      nextUnitOfWork: null,
      workingRoot: null,
      currentRoot: null,
      deletions: null,
      workingFiber: null,
      hookIndex: null,
    };
  });

  describe('createElement', () => {
    it('should create element with correct type and props', () => {
      const element = MyReact.createElement(
        'div',
        { className: 'test' },
        'Hello'
      );

      expect(element).toEqual({
        type: 'div',
        props: {
          className: 'test',
          children: [
            {
              type: 'TEXT_ELEMENT',
              props: {
                nodeValue: 'Hello',
                children: [],
              },
            },
          ],
        },
      });
    });

    it('should handle multiple children', () => {
      const element = MyReact.createElement(
        'div',
        null,
        'Hello',
        MyReact.createElement('span', null, 'World')
      );

      expect(element.props.children).toHaveLength(2);
      expect(element.props.children[0].props.nodeValue).toBe('Hello');
      expect(element.props.children[1].type).toBe('span');
    });
  });

  describe('render', () => {
    it('should render element to container', async () => {
      const container = document.createElement('div');
      const element = MyReact.createElement(
        'div',
        null,
        MyReact.createElement('p', null, 'Test')
      );

      MyReact.render(element, container);

      // Wait for all microtasks and timers to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(container.innerHTML).toBe('<div><p>Test</p></div>');
    });
  });

  describe('useState', () => {
    it('should manage state correctly', () => {
      let setState;
      const TestComponent = () => {
        const [count, setCount] = MyReact.useState(0);
        setState = setCount;
        return MyReact.createElement('div', null, count.toString());
      };

      const container = document.createElement('div');
      const element = MyReact.createElement(TestComponent, null);
      
      MyReact.render(element, container);

      return new Promise(resolve => setTimeout(resolve, 0))
        .then(() => {
          expect(container.textContent).toBe('0');
          
          // Update state
          setState(prev => prev + 1);
          return new Promise(resolve => setTimeout(resolve, 0));
        })
        .then(() => {
          expect(container.textContent).toBe('1');
        });
    });

    it('should preserve state between renders', () => {
      let renderCount = 0;
      let setState;

      const TestComponent = () => {
        renderCount++;
        const [testState, setTestState] = MyReact.useState('initial');
        setState = setTestState;
        return MyReact.createElement('div', null, testState);
      };

      const container = document.createElement('div');
      const element = MyReact.createElement(TestComponent, null);
      
      MyReact.render(element, container);

      return new Promise(resolve => setTimeout(resolve, 0))
        .then(() => {
          expect(container.textContent).toBe('initial');
          setState(() => 'updated');
          return new Promise(resolve => setTimeout(resolve, 0));
        })
        .then(() => {
          expect(container.textContent).toBe('updated');
          expect(renderCount).toBe(2);
        });
    });
  });
}); 