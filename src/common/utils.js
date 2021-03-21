
import marked from 'marked'

/**
 * 解析Markdown内容
 */
export function parseMarkdown(content, config) {
  const questions = []
  const category = config.path.split('/').join(' / ')
  const patt = new RegExp(`${'#'.repeat(config.level)}\\s(.*)`, 'ig')
  const matchResult = content.matchAll(patt)
  const matchTitleList = []
  for (const iterator of matchResult) {
    matchTitleList.push({
      mdTitle: iterator[0],
      title: iterator[1],
      index: iterator.index
    })
  }
  for (let index = 0; index < matchTitleList.length; index++) {
    const item = matchTitleList[index]
    const nextItem = matchTitleList[index + 1]
    const startIndex = item.index + item.mdTitle.length
    questions.push({
      id: `${config.path}/${index + 1}`,
      category,
      title: item.title,
      content: marked(content.substring(startIndex, nextItem ? nextItem.index - 1 : content.length))
    })
  }
  return questions
}
