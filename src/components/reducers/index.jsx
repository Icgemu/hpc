
export const addTab = ({id,path,title}) => {
  return {
    type: 'ADD_TAB',
    id,
    title,
    path
  }
}


export const delTab = (id) => {
  return {
    type: 'DEL_TAB',
    id
  }
}

export const activeTab = (id) => {
  return {
    type: 'ACTIVE_TAB',
    id
  }
}

export const activeLink = (id) => {
  return {
    type: 'ACTIVE_LINK',
    id
  }
}

export const activeUrl = (id) => {
  return {
    type: 'ACTIVE_URL',
    id
  }
}
