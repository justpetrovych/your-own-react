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

  describe('style prop', () => {
    it('should apply object styles to DOM element', async () => {
      const container = document.createElement('div');
      const element = MyReact.createElement(
        'div',
        {
          style: {
            color: 'red',
            fontSize: '14px',
            backgroundColor: 'blue'
          }
        },
        'Styled text'
      );

      MyReact.render(element, container);

      // Wait for all microtasks and timers to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      const divElement = container.querySelector('div');
      expect(divElement.style.color).toBe('red');
      expect(divElement.style.fontSize).toBe('14px');
      expect(divElement.style.backgroundColor).toBe('blue');
    });

    it('should update styles when they change', async () => {
      let updateStyle;
      const TestComponent = () => {
        const [style, setStyle] = MyReact.useState({ color: 'red', fontSize: '12px' });
        updateStyle = setStyle;
        return MyReact.createElement('div', { style }, 'Styled text');
      };

      const container = document.createElement('div');
      const element = MyReact.createElement(TestComponent, null);

      MyReact.render(element, container);

      await new Promise(resolve => setTimeout(resolve, 100));

      const divElement = container.querySelector('div');
      expect(divElement.style.color).toBe('red');
      expect(divElement.style.fontSize).toBe('12px');

      // Update styles
      updateStyle(() => ({ color: 'blue', fontSize: '16px' }));
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(divElement.style.color).toBe('blue');
      expect(divElement.style.fontSize).toBe('16px');
    });

    it('should remove styles that are no longer present', async () => {
      let updateStyle;
      const TestComponent = () => {
        const [style, setStyle] = MyReact.useState({ color: 'red', fontSize: '12px' });
        updateStyle = setStyle;
        return MyReact.createElement('div', { style }, 'Styled text');
      };

      const container = document.createElement('div');
      const element = MyReact.createElement(TestComponent, null);

      MyReact.render(element, container);

      await new Promise(resolve => setTimeout(resolve, 100));

      const divElement = container.querySelector('div');
      expect(divElement.style.color).toBe('red');
      expect(divElement.style.fontSize).toBe('12px');

      // Update with only color (fontSize should be removed)
      updateStyle(() => ({ color: 'blue' }));
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(divElement.style.color).toBe('blue');
      expect(divElement.style.fontSize).toBe('');
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

  describe('useEffect', () => {
    it('should run effect on mount', () => {
      let effectRan = false;
      const TestComponent = () => {
        MyReact.useEffect(() => {
          effectRan = true;
        }, []);
        return MyReact.createElement('div', null, 'Test');
      };

      const container = document.createElement('div');
      const element = MyReact.createElement(TestComponent, null);

      MyReact.render(element, container);

      return new Promise(resolve => setTimeout(resolve, 0))
        .then(() => {
          expect(effectRan).toBe(true);
        });
    });

    it('should run effect only once with empty dependency array', () => {
      let effectCount = 0;
      let setState;

      const TestComponent = () => {
        const [count, setCount] = MyReact.useState(0);
        setState = setCount;

        MyReact.useEffect(() => {
          effectCount++;
        }, []); // Empty array - should run only once

        return MyReact.createElement('div', null, count.toString());
      };

      const container = document.createElement('div');
      const element = MyReact.createElement(TestComponent, null);

      MyReact.render(element, container);

      return new Promise(resolve => setTimeout(resolve, 0))
        .then(() => {
          expect(effectCount).toBe(1);

          // Trigger re-render
          setState(prev => prev + 1);
          return new Promise(resolve => setTimeout(resolve, 0));
        })
        .then(() => {
          // Effect should not run again
          expect(effectCount).toBe(1);
        });
    });

    it('should run effect when dependencies change', () => {
      let effectCount = 0;
      let setState;

      const TestComponent = () => {
        const [count, setCount] = MyReact.useState(0);
        setState = setCount;

        MyReact.useEffect(() => {
          effectCount++;
        }, [count]); // Depends on count

        return MyReact.createElement('div', null, count.toString());
      };

      const container = document.createElement('div');
      const element = MyReact.createElement(TestComponent, null);

      MyReact.render(element, container);

      return new Promise(resolve => setTimeout(resolve, 0))
        .then(() => {
          expect(effectCount).toBe(1);

          // Update count - should trigger effect
          setState(prev => prev + 1);
          return new Promise(resolve => setTimeout(resolve, 0));
        })
        .then(() => {
          expect(effectCount).toBe(2);
        });
    });

    it('should not run effect when dependencies do not change', () => {
      let effectCount = 0;
      let setState1;
      let setState2;

      const TestComponent = () => {
        const [count, setCount] = MyReact.useState(0);
        const [other, setOther] = MyReact.useState('test');
        setState1 = setCount;
        setState2 = setOther;

        MyReact.useEffect(() => {
          effectCount++;
        }, [count]); // Only depends on count

        return MyReact.createElement('div', null, count.toString() + other);
      };

      const container = document.createElement('div');
      const element = MyReact.createElement(TestComponent, null);

      MyReact.render(element, container);

      return new Promise(resolve => setTimeout(resolve, 0))
        .then(() => {
          expect(effectCount).toBe(1);

          // Update other - should NOT trigger effect
          setState2(() => 'changed');
          return new Promise(resolve => setTimeout(resolve, 0));
        })
        .then(() => {
          expect(effectCount).toBe(1);

          // Update count - should trigger effect
          setState1(prev => prev + 1);
          return new Promise(resolve => setTimeout(resolve, 0));
        })
        .then(() => {
          expect(effectCount).toBe(2);
        });
    });

    it('should run effect on every render when no dependencies provided', () => {
      let effectCount = 0;
      let setState;

      const TestComponent = () => {
        const [count, setCount] = MyReact.useState(0);
        setState = setCount;

        MyReact.useEffect(() => {
          effectCount++;
        }); // No dependency array - should run every render

        return MyReact.createElement('div', null, count.toString());
      };

      const container = document.createElement('div');
      const element = MyReact.createElement(TestComponent, null);

      MyReact.render(element, container);

      return new Promise(resolve => setTimeout(resolve, 0))
        .then(() => {
          expect(effectCount).toBe(1);

          // Trigger re-render
          setState(prev => prev + 1);
          return new Promise(resolve => setTimeout(resolve, 0));
        })
        .then(() => {
          expect(effectCount).toBe(2);

          // Trigger another re-render
          setState(prev => prev + 1);
          return new Promise(resolve => setTimeout(resolve, 0));
        })
        .then(() => {
          expect(effectCount).toBe(3);
        });
    });

    it('should call cleanup function before next effect', () => {
      let cleanupCount = 0;
      let effectCount = 0;
      let setState;

      const TestComponent = () => {
        const [count, setCount] = MyReact.useState(0);
        setState = setCount;

        MyReact.useEffect(() => {
          effectCount++;
          return () => {
            cleanupCount++;
          };
        }, [count]);

        return MyReact.createElement('div', null, count.toString());
      };

      const container = document.createElement('div');
      const element = MyReact.createElement(TestComponent, null);

      MyReact.render(element, container);

      return new Promise(resolve => setTimeout(resolve, 0))
        .then(() => {
          expect(effectCount).toBe(1);
          expect(cleanupCount).toBe(0);

          // Trigger re-render - cleanup should run before new effect
          setState(prev => prev + 1);
          return new Promise(resolve => setTimeout(resolve, 0));
        })
        .then(() => {
          expect(effectCount).toBe(2);
          expect(cleanupCount).toBe(1);
        });
    });

    it('should handle multiple effects', () => {
      let effect1Count = 0;
      let effect2Count = 0;
      let setState;

      const TestComponent = () => {
        const [count, setCount] = MyReact.useState(0);
        setState = setCount;

        MyReact.useEffect(() => {
          effect1Count++;
        }, []); // Run once

        MyReact.useEffect(() => {
          effect2Count++;
        }, [count]); // Run on count change

        return MyReact.createElement('div', null, count.toString());
      };

      const container = document.createElement('div');
      const element = MyReact.createElement(TestComponent, null);

      MyReact.render(element, container);

      return new Promise(resolve => setTimeout(resolve, 0))
        .then(() => {
          expect(effect1Count).toBe(1);
          expect(effect2Count).toBe(1);

          // Trigger re-render
          setState(prev => prev + 1);
          return new Promise(resolve => setTimeout(resolve, 0));
        })
        .then(() => {
          expect(effect1Count).toBe(1); // Should not run again
          expect(effect2Count).toBe(2); // Should run again
        });
    });

    it('should work with complex dependencies', () => {
      let effectCount = 0;
      let setState;

      const TestComponent = () => {
        const [obj, setObj] = MyReact.useState({ value: 0 });
        setState = setObj;

        MyReact.useEffect(() => {
          effectCount++;
        }, [obj.value]);

        return MyReact.createElement('div', null, obj.value.toString());
      };

      const container = document.createElement('div');
      const element = MyReact.createElement(TestComponent, null);

      MyReact.render(element, container);

      return new Promise(resolve => setTimeout(resolve, 0))
        .then(() => {
          expect(effectCount).toBe(1);

          // Update with same value
          setState(() => ({ value: 0 }));
          return new Promise(resolve => setTimeout(resolve, 0));
        })
        .then(() => {
          expect(effectCount).toBe(1); // Should not run - same value

          // Update with different value
          setState(() => ({ value: 1 }));
          return new Promise(resolve => setTimeout(resolve, 0));
        })
        .then(() => {
          expect(effectCount).toBe(2); // Should run - different value
        });
    });
  });
}); 