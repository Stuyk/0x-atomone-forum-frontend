export interface ActionQuery {
    a: string,    
}

export interface ActionThreadCreate extends ActionQuery {
    t: string;
    c: string;
}

export interface ActionMessageAdd extends ActionQuery {
    th: string;
    c: string;
}

export interface ActionMessageUpvote extends ActionQuery {
    th: string;
    mh: string;
}

export interface ActionMessageRemove extends ActionQuery {
    th: string;
    mh: string;
}

export interface ActionThreadRemove extends ActionQuery {
    th: string;
}

export interface ActionAdminAdd extends ActionQuery {
    addr: string;
}

export interface ActionAdminRemove extends ActionQuery {
    addr: string;
}