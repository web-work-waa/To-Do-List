interface IPosition {
  x: number;
  y: number;
}

interface IContextMenuItem {
  name: string;
  icon: string;
}

interface ContextMenuItemProps {
  index: number;
  name: string;
  icon: string;
  active: boolean;
  position: IPosition;
  offset: IPosition;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = (props: ContextMenuItemProps) => {
  const [active, setActive] = React.useState<boolean>(false),
        [visible, setVisible] = React.useState<boolean>(false),
        [position, setPosition] = React.useState<>({ x: 0, y: 0 });
  
  React.useEffect(() => {
    if(props.active){
      setActive(props.active);
      setPosition({ x: props.position.x, y: props.position.y });
      setTimeout(() => setVisible(true), 50);
    }
    else{
      setVisible(false);
      setTimeout(() => setActive(false), 350);
    }
  }, [props.active]);
  
  React.useEffect(() => {
    setPosition({ x: props.position.x, y: props.position.y });
  }, [props.position]);
  
  if(active){
    const getStyles = (): React.CSSProperties => {
      const left: number = visible ? position.x + props.offset.x : position.x,
            opacity: number = visible ? 1 : 0,
            top: number = visible ? position.y + props.offset.y : position.y;
      
      return {
        left: `${left}px`,
        opacity,
        top: `${top}px`,
        transitionDelay: `${props.index * 50}ms`
      }
    }
    
    return ReactDOM.createPortal((
      <button type="button" className="context-menu-item" style={getStyles()}>
        <i className={props.icon} />
        <h1>{props.name}</h1>
      </button>
    ), document.getElementById("app"));
  }

  return null;
}

interface AppProps {
  
}

const App: React.FC<AppProps> = (props: AppProps) => {
  const [active, setActive] = React.useState<boolean>(false),
        [position, setPosition] = React.useState<>({ x: 0, y: 0 });
  
  const [menuRadius, setMenuRadius] = React.useState<number>(100),
        [itemRadius, setItemRadius] = React.useState<number>(25);
  
  const [contextMenuItems, setContextMenuItems] = React.useState<>([]);
  
  React.useEffect(() => { // Only for CodePen preview
    setTimeout(() => {
      const centerX: number = (window.innerWidth / 2) - (menuRadius / 4),
            centerY: number = (window.innerHeight / 3) - (menuRadius / 4);
      
      setPosition({ x: centerX, y: centerY });
      
      setActive(true);      
    }, 500);
  }, []);
  
  React.useEffect(() => {
    setContextMenuItems([
      { name: "Cut", icon: "fas fa-cut" },
      { name: "Copy", icon: "far fa-copy" },
      { name: "Paste", icon: "fas fa-paste" },
      { name: "Comment", icon: "far fa-comment" },
      { name: "Like", icon: "far fa-thumbs-up" },
      { name: "Delete", icon: "fas fa-trash" }
    ]);
  }, []);
  
  React.useEffect(() => {
    const handleClick = (e: any): void => {
      const items: JSX.Element[] = document.getElementsByClassName("context-menu-item");
      
      if(items && items.length > 0){
        let count: number = 0;
        
        for(let i = 0; i < items.length; i++){
          if(items[i].contains(e.target)){
            count++;
          }
        }
        
        if(count === 0){
          setActive(false);
        }
      }
      else{
        setActive(false);
      }
    }
    
    document.addEventListener("click", handleClick);
    
    return () => {
      document.removeEventListener("click", handleClick);
    }
  }, []);
  
  const handleOnContextMenu = (e: any): void => {
    e.preventDefault();
    setActive(true);
    setPosition({ x: e.clientX - itemRadius, y: e.clientY - itemRadius });
  }
  
  const getContextMenuItems = (): JSX.Element[] => {
    const getOffset = (index: number): void => {
      const step: number = (2 * Math.PI) / contextMenuItems.length,
            angle: number = index * step;
      
      const x: number = Math.round(menuRadius + (menuRadius * Math.cos(angle)) - itemRadius - (menuRadius - itemRadius)),
            y: number = Math.round(menuRadius + (menuRadius * Math.sin(angle)) - itemRadius - (menuRadius - itemRadius));
      
      return { x, y };
    }
    
    return contextMenuItems.map((item: IContextMenuItem, index: number) => {
      return(
        <ContextMenuItem
          key={item.name}
          index={index}
          name={item.name}
          icon={item.icon}
          active={active}
          position={position}
          offset={getOffset(index)}
        />
      )
    })
  }
  
  return(
    <div id="app" onContextMenu={handleOnContextMenu}>
      {getContextMenuItems()}
      <div id="instructions">
        <h1>Right click to open, left click to close</h1>
      </div>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById("root"));
