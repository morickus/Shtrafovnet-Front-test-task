import { message } from 'antd'
import copy from 'copy-to-clipboard'

const CopyToClipboard = (text: string, completeMsg = 'скопировано') => {
  copy(text)
  message.success(completeMsg)
};

export default CopyToClipboard
