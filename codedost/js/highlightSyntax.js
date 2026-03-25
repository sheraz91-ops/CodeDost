<pre id="code-input" class="language-js"
     data-placeholder="# Yahan apna code paste karo...
# Example:
def calculate_total(items):
    total = 0
    for item in items
        total += item['price']
    return total"
    contenteditable="true"></pre>
const editor = document.getElementById("code-input");

editor.addEventListener("input", () => {
  const cursorOffset = getCaretCharacterOffsetWithin(editor);

  const text = editor.innerText;

  editor.textContent = text;
  Prism.highlightElement(editor);

  setCaretCharacterOffsetWithin(editor, cursorOffset);
});


function getCaretCharacterOffsetWithin(element) {
  let caretOffset = 0;
  const sel = window.getSelection();

  if (sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    const preRange = range.cloneRange();

    preRange.selectNodeContents(element);
    preRange.setEnd(range.endContainer, range.endOffset);

    caretOffset = preRange.toString().length;
  }

  return caretOffset;
}


function setCaretCharacterOffsetWithin(element, offset) {
  const range = document.createRange();
  const sel = window.getSelection();

  let currentOffset = 0;

  function walk(node) {
    if (node.nodeType === 3) {
      const nextOffset = currentOffset + node.length;

      if (offset <= nextOffset) {
        range.setStart(node, offset - currentOffset);
        range.collapse(true);
        return true;
      }

      currentOffset = nextOffset;
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        if (walk(node.childNodes[i])) return true;
      }
    }
    return false;
  }

  walk(element);

  sel.removeAllRanges();
  sel.addRange(range);
}
function setCaretToStart(el) {
  const range = document.createRange();
  const sel = window.getSelection();

  range.setStart(el, 0);
  range.collapse(true);

  sel.removeAllRanges();
  sel.addRange(range);
}

const el = document.getElementById("code-input");

function togglePlaceholder() {
  el.classList.toggle("empty", el.textContent.trim() === "");
}

el.addEventListener("input", togglePlaceholder);
togglePlaceholder();