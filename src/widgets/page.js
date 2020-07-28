import { style } from "typestyle";
import { vertical, width, height } from "csstips";
import { value, styler, listen, tween, pointer } from "popmotion";
import verge from "verge";
import { render, Component, createRef, unmountComponentAtNode } from "anujs";
import { Plugins } from "@capacitor/core";

const { App } = Plugins;
const screenWidth = verge.viewportW();

class Page extends Component {
  constructor(props) {
    super(props);

    this.dom = createRef()
    this.startListener = null
    this.endListner = null
    this.close = null
  }

  componentDidMount() {
    console.log("register page");
    const page = styler(this.dom.current);
    const pageX = value(0, x => page.set("x", x));

    this.close = () => {
      tween({
        from: pageX.get(),
        to: screenWidth,
      }).start({
        update: (x) => page.set("x", x),
        complete: () => unmountComponentAtNode(this.dom.current.parentNode)
      });
    };

    tween({
      from: screenWidth,
      to: 0,
      duration: 250,
    }).start({
      update: (x) => page.set("x", x),
      complete: () => {
        this.startListener = listen(this.dom.current, "mousedown touchstart").start((e) => {
          // 捕捉鼠标坐标和点击坐标
          const tapX = e.touches ? e.touches[0].pageX : e.pageX;
          console.log("touch start:", tapX);
          if (tapX < 25) {
            // 在边缘位置才滑动页面
            pointer({ x: pageX.get() })
              .filter(({ x }) => x > 0)
              .pipe(({ x }) => x)
              .start(pageX);
          }
        });

        this.endListner = listen(this.dom.current, "mouseup touchend").start(() => {
          console.log('touchend:', pageX.get());
          console.log('screenWidth / 4:', screenWidth / 4)

          const criticalLine = screenWidth / 4
          if (pageX.get() <= criticalLine && pageX.get() > 0) {
            tween({
              from: pageX.get(),
              to: 0,
            }).start(pageX);
          } else if (pageX.get() > criticalLine) {
            this.close();
          }
        });
      },
    });

    App.addListener("backButton", this.close);
  }

  componentWillUnmount() {
    console.log("unmount");
    this.startListener.stop();
    this.endListner.stop();

    App.removeAllListeners();
  }

  render() {
    return (
      <c-page
        class={style(vertical, width("100%"), height("100%"), {
          position: "fixed",
          top: 0,
          backgroundColor: "white",
          zIndex: 999,
          boxShadow: `-5px 0 10px #b8b8b8`,
        })}
        ref={this.dom}
      >
        {this.props.children}
      </c-page>
    );
  }
}

export const newPage = (children) => render(<Page>{children}</Page>, document.getElementById("core"));

