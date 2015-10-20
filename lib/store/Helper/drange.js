/* customize range object, 自定义的range类型 */
module.exports =function Drange(opt){
    if(!(this instanceof Drange)){
        return new Drange(opt);
    }
    this.startId = opt.startId;
    this.endId = opt.endId;
    this.startOffset = opt.startOffset;
    this.endOffset = opt.endOffset;

    Object.defineProperty(this, "collapsed", {
        get:() => {
            return (this.startId === this.endId && this.startOffset === this.endOffset);
        }
    });
    return this;
}
