import Composer from '../../verdor/composer';

class Editor extends React.Component{
    componentDidMount () {
        // 防止整个页面意外放置文件导致打开文件
        document.body.addEventListener('dragover', function(e){
            e.preventDefault();
        });
    }
    render () {
        return (
            <div className="editor"
                onDragEnter={ this.dragEnterHandler }
                onDragOver={ this.dragOverHandler }
                onDrop={ this.dropHandler }
                >
                React editor, with fat arrow auto-bind
                <Composer />
            </div>
        );
    }
    dragEnterHandler (e) {

    }
    // 绑定dragover并阻止默认事件, 是不显示鼠标+和放开文件不默认打开的关键
    dragOverHandler (e) {
        e.preventDefault();
    }
    dropHandler = (e) => {
        e.preventDefault();
        console.log(this);
        var file = e.dataTransfer.files[0];
        var reader = new FileReader();
        reader.onload = function(){
            // console.log(arguments);
            console.log(reader.result);
        }
        reader.readAsDataURL(file);
    }
}


// ondragenter
// ondragover
// ondragleave
// ondragend
// ondrop

export default Editor;
