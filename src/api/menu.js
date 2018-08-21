const Menu = [
  {header: 'Apps'},
  {
    title: 'Dashboard',
    group: 'apps',
    icon: 'dashboard',
    name: 'Dashboard'
  },
  {
    title: 'Storage',
    group: 'apps',
    icon: 'cloud',
    name: 'Storage'
  },
  {
    title: 'Functions',
    group: 'functions',
    icon: 'functions',
    items: [
      // { name: 'post', title: 'Post', component: 'components/widget-post' },
    ]
  }
]
// reorder menu
Menu.forEach((item) => {
  if (item.items) {
    item.items.sort((x, y) => {
      let textA = x.title.toUpperCase()
      let textB = y.title.toUpperCase()
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })
  }
})

export default Menu
