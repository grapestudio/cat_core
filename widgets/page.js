import { style } from 'typestyle'
import { vertical, width, height } from 'csstips'
import { value, styler, listen, tween, pointer } from 'popmotion'
import verge from 'verge'
import { render, useEffect } from 'anujs'
import { Plugins } from '@capacitor/core'
// import { mark, back } from '../libs/stacks'

const { App } = Plugins
const screenWidth = verge.viewportW()

const Page = ({ children }) => {
  function register(ref) {
    const page = styler(ref)
    const pageX = value(0, (x) => page.set('x', x))

    const closePage = () => {
      tween({ from: pageX.get(), to: screenWidth }).start({
        update: (x) => page.set('x', x),
        complete: () => ref.remove(),
      })
    }

    // mark(closePage)

    tween({ from: screenWidth, to: 0, duration: 250 }).start({
      update: (x) => page.set('x', x),
      complete: () => {
        listen(ref, 'mousedown touchstart').start((e) => {
          // 捕捉鼠标坐标和点击坐标
          const tapX = e.touches ? e.touches[0].pageX : e.pageX
          // console.log(tapX);
          if (tapX < 25) {
            // 在边缘位置才滑动页面
            pointer({ x: pageX.get() })
              .filter(({ x }) => x > 0)
              .pipe(({ x }) => x)
              .start(pageX)
          }
        })

        listen(ref, 'mouseup touchend').start(() => {
          if (pageX.get() <= screenWidth / 4) {
            tween({ from: pageX.get(), to: 0 }).start(pageX)
          } else {
            // back()
          }
        })
      },
    })

    // useEffect(() => {
    //   // 安卓返回键监听
    //   App.addListener('backButton', back)
    //   // 清空监听
    //   return () => App.removeAllListeners()
    // })
  }

  return (
    <c-page
      class={style(vertical, width('100%'), height('100%'), {
        position: 'fixed',
        top: 0,
        backgroundColor: 'white',
        zIndex: 999,
        boxShadow: `-5px 0 10px #b8b8b8`,
      })}
      ref={register}
    >
      {children}
    </c-page>
  )
}

export const newPage = (children) => {
  render(() => <Page>{children}</Page>, document.body)
}
