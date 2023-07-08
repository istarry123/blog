export function toc(content) {
    const tree = content
        .filter(el => /h([1-6])/.test(el.tag))
        .map(el => {
            const text = typeof el.content[1] === 'string' ? el.content[1] : getString(el.content[1]);
            return { id: el.attrs.id, text, level: el.tag[1] };
        });
    const className = 'toc';
    // 是否显示序号
    const listNumber = false;
    if (!tree.length) return null;
    let result = `<ul class="${className}">`;
    const lastNumber = [0, 0, 0, 0, 0, 0];
    let firstLevel = 0;
    let lastLevel = 0;
    for (let i = 0, len = tree.length; i < len; i++) {
        const el = tree[i];
        const { level, id, text } = el;
        const href = id ? `#${encodeURI(id)}` : null;
        if (!el.unnumbered) {
            lastNumber[level - 1]++;
        }
        for (let i = level; i <= 5; i++) {
            lastNumber[i] = 0;
        }
        if (firstLevel) {
            for (let i = level; i < lastLevel; i++) {
                result += '</li></ul>';
            }
            if (level > lastLevel) {
                result += `<ul class="${className}-child">`;
            } else {
                result += '</li>';
            }
        } else {
            firstLevel = level;
        }
        result += `<li class="${className}-item ${className}-level-${level}">`;
        if (href) {
            result += `<a class="${className}-link" href="${href}">`;
        } else {
            result += `<a class="${className}-link">`;
        }
        if (listNumber && !el.unnumbered) {
            result += `<span class="${className}-number">`;
            for (let i = firstLevel - 1; i < level; i++) {
                result += `${lastNumber[i]}.`;
            }
            result += '</span> ';
        }
        result += `<span class="${className}-text">${text}</span></a>`;
        lastLevel = level;
    }
    for (let i = firstLevel - 1; i < lastLevel; i++) {
        result += '</li></ul>';
    }
    return { result, tree };
}

function getString(content) {
    if (typeof content.content[0] === 'string') return content.content[0];
    return getString(content.content[0]);
}