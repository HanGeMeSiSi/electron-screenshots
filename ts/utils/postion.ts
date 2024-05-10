interface PostionType {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 判断一个位置是否在一个位置内（用于判断应用程序在哪个屏幕内）
 */
function APostionIsWithInBPostion(APostion: PostionType, BPostion: PostionType) {
  const { x: Ax, y: Ay, width: Awidth, height: Aheight } = APostion;
  const { x: Bx, y: By, width: Bwidth, height: Bheight } = BPostion;
  return (Ax >= Bx) && (Ax + Awidth <= Bx + Bwidth) && (Ay >= By) && (Ay + Aheight <= By + Bheight);
}

/**
 * 两个矩形 A 和 B 是否有任何重叠部分，你可以使用以下逻辑
 */
function isRectangleOverlap(APostion: PostionType, BPostion: PostionType) {
  const { x: Ax, y: Ay, width: Awidth, height: Aheight } = APostion;
  const { x: Bx, y: By, width: Bwidth, height: Bheight } = BPostion;
  return (Ax + Awidth > Bx) && (Ax < Bx + Bwidth) && (Ay + Aheight > By) && (Ay < By + Bheight);
}

export {
  APostionIsWithInBPostion,
  isRectangleOverlap,
};
