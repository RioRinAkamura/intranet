import { Env } from 'remarkable/lib';

const mentionRegexp = /@+([\w ]+)+\(([\w+-]+)\)/;
export const mentionRemarkPlugin = (remarkable: Env) => {
  remarkable.inline.ruler.push('mention', (state: Env, silent: boolean) => {
    if (!state.src) {
      return false;
    }

    if (state.src[state.pos] !== '@') {
      return false;
    }
    var match = mentionRegexp.exec(state.src.slice(state.pos));
    if (!match) {
      return false;
    }

    if (!silent) {
      state.push({
        type: 'mention_open',
        name: match[1],
        id: match[2],
        link: 'employees/' + match[2],
        level: state.level,
      });

      state.push({
        type: 'text',
        content: '@' + match[1],
        level: state.level + 1,
      });

      state.push({
        type: 'mention_close',
        level: state.level,
      });
    }
    state.pos += match[0].length;

    return true;
  });
};
