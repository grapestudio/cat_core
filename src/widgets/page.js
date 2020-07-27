import { style } from "typestyle";
import { vertical, width, height } from "csstips";
import { value, styler, listen, tween, pointer } from "popmotion";
import verge from "verge";
import { render, Component, unmountComponentAtNode } from "anujs";
import { Plugins } from "@capacitor/core";

const { App } = Plugins;
const screenWidth = verge.viewportW();

class Page extends Component {
  constructor(props) {
    super(props);

    this.register = (ref) => {
      console.log("register page");
      const page = styler(ref);
      const pageX = value(0, (x) => page.set("x", x));

      const closePage = () => {
        tween({
          from: pageX.get(),
          to: screenWidth,
        }).start({
          update: (x) => page.set("x", x),
          complete: () => {
            unmountComponentAtNode(ref);
            ref.remove();
          },
        });
      };

      // mark(closePage);

      tween({
        from: screenWidth,
        to: 0,
        duration: 250,
      }).start({
        update: (x) => page.set("x", x),
        complete: () => {
          listen(ref, "mousedown touchstart").start((e) => {
            console.log("touch start");
            // 捕捉鼠标坐标和点击坐标
            const tapX = e.touches ? e.touches[0].pageX : e.pageX;
            if (tapX < 25) {
              // 在边缘位置才滑动页面
              pointer({ x: pageX.get() })
                .filter(({ x }) => x > 0)
                .pipe(({ x }) => x)
                .start(pageX);
            }
          });

          listen(ref, "mouseup touchend").start(() => {
            console.log(pageX.get());
            if (pageX.get() <= screenWidth / 4) {
              tween({
                from: pageX.get(),
                to: 0,
              }).start(pageX);
            } else {
              closePage();
            }
          });
        },
      });
    };
  }

  componentDidMount() {
    // App.addListener("backButton", closePage);
  }

  componentWillUnmount() {
    console.log("unmount");
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
        ref={this.register}
      >
        {this.props.children}
      </c-page>
    );
  }
}

export const newPage = (children) => {
  render(<Page>{children}</Page>, document.getElementById("core"));
};
