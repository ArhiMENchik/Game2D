import {ElNotification} from "element-plus";

const position = 'top-right'  // top-right | top-left | bottom-left | bottom-right

export default class Notify {
  static success(msg, title = 'Успешно') {
    ElNotification({
      title: title,
      message: msg,
      type: 'success',
      position: position,
    })
  }

  static info(msg, title = 'Инфо') {
    ElNotification({
      title: title,
      message: msg,
      type: 'info',
      position: position
    })
  }

  static warning(msg, title = 'Предупреждение') {
    ElNotification({
      title: title,
      message: msg,
      type: 'warning',
      position: position
    })
  }

  static error(msg, title = 'Ошибка') {
    if (typeof msg !== 'string') {
      msg = JSON.stringify(msg)
    }

    ElNotification({
      title: title,
      message: msg,
      type: 'error',
      position: position
    })
  }
}
