import React, { memo, useEffect, useRef, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderRounded from '@mui/icons-material/FolderRounded';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import {
  TreeItemCheckbox,
  TreeItemIconContainer,
  TreeItemLabel,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { TreeItemDragAndDropOverlay } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';
import { Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { MoreVerticalIcon, Pen, Trash } from 'lucide-react';
import { eliminarCarpeta, obtenerCarpetasWithContentByUser } from '@/services/Carpetas';
import AddCarpetaModal from '../features/carpetas/AddCarpetaModal';
import { UseContextSearch } from '@/context/SearchContext';
import { eliminarEnlace } from '@/services/Enlaces';
import { useNavigate } from 'react-router-dom';


function DotIcon() {
  return (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '70%',
        bgcolor: 'warning.main',
        display: 'inline-block',
        verticalAlign: 'middle',
        zIndex: 1,
        mx: 1,
      }}
    />
  );
}

const TreeItemRoot = styled('li')(({ theme }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  outline: 0,
  color: theme.palette.grey[800],
  ...theme.applyStyles('light', {
    color: theme.palette.grey[600],
  }),
}));

const TreeItemContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
  width: '100%',
  boxSizing: 'border-box', // prevent width + padding to overflow
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  flexDirection: 'row-reverse',
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  fontWeight: 500,
  '&[data-expanded]:not([data-focused], [data-selected]) .labelIcon': {
    color: theme.palette.primary.main,
    ...theme.applyStyles('light', {
      color: theme.palette.primary.main,
    }),
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '16px',
      top: '44px',
      height: 'calc(100% - 48px)',
      width: '1.5px',
      backgroundColor: `bg-color`,
      ...theme.applyStyles('light', {
        backgroundColor: theme.palette.grey[300],
      }),
    },
  },
  [`&[data-focused], &[data-selected]`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    ...theme.applyStyles('light', {
      backgroundColor: theme.palette.primary.main,
    }),
  },
  '&:not([data-focused], [data-selected]):hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: 'white',
    ...theme.applyStyles('light', {
      color: theme.palette.primary.main,
    }),
  },
}));

const CustomCollapse = styled(Collapse)({
  padding: 0,
});

const AnimatedCollapse = animated(CustomCollapse);

/**
 * 
 * @param {*} props 
 * @returns "Controla desde donde comienza la animacion de subida"
 */
function TransitionComponent(props) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

const TreeItemLabelText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[100], // texto claro por defecto
  fontFamily: 'inherit',
  fontWeight: 700,
}));


const getIconFromFileType = (fileType) => {
  switch (fileType) {
    case 'image':
      return ImageIcon;
    case 'pdf':
      return PictureAsPdfIcon;
    case 'doc':
      return ArticleIcon;
    case 'video':
      return VideoCameraBackIcon;
    case 'page':
      return InsertDriveFileOutlinedIcon;
    case 'folder':
      return FolderRounded;
    case 'pinned':
      return FolderOpenIcon;
    case 'trash':
      return DeleteIcon;
    default:
      return ArticleIcon;
  }
};

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { id, itemId, label, disabled, children, onEditFile,
     onEditFolder, onDeleteFolder, onDeleteFile, ...other } = props;

  const { getContextProviderProps, getRootProps, getContentProps,
          getIconContainerProps, getCheckboxProps, getLabelProps,
          getGroupTransitionProps, getDragAndDropOverlayProps, status } =
    useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });
  
  //Se obtiene el item a renderizar a travez del id.
  const item = useTreeItemModel(itemId);
  //Se determina su icono segun el tipo de archivo del item.
  let icon = status.expandable ? FolderRounded : getIconFromFileType(item.fileType);
  //Se obtinen propiedades inherentes de TreeView.
  const labelProps = getLabelProps({
  icon,
  expandable: status.expandable && status.expanded,});


  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps(other)}>
        <TreeItemContent {...getContentProps()}>
          { item.fileType === "folder" ? 
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          : null}
          <TreeItemCheckbox {...getCheckboxProps()} />
            { item.fileType === "page" ?
            <LinkLabelWithMenu
              {...labelProps}
              itemId={itemId}
              label={label}
              onDelete={onDeleteFile}
              onEdit={onEditFile}   
            /> :
            <FolderLabelWithMenu
              {...labelProps}
              itemId={itemId}
              label={label}
              onEdit={onEditFolder}
              onDelete={onDeleteFolder}  
            />
            }
          <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </TreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});





function LinkLabelWithMenu({ icon: Icon, itemId, label, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // 🧠 Referencia para detectar overflow
  const textRef = useRef(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  // Detecta si el texto se desborda visualmente
  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsOverflowed(el.scrollWidth > el.clientWidth);
    }
  }, [label]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0, maxWidth: 160, }}>
      {Icon && <Icon style={{ marginRight: 8 }} />}

      {/* 🟢 Tooltip solo si hay overflow */}
      <Tooltip title={isOverflowed ? label : ""}  placement="top"
        disableHoverListener={!isOverflowed}>
        <span ref={textRef}
          style={{flex: 1, overflow: "hidden", whiteSpace: "nowrap",
          textOverflow: "ellipsis" , display: "inline-block", }}>
          {label}
        </span>
      </Tooltip>

      <IconButton size="small" style={{ marginLeft: "auto" }}
        onClick={(e) => { e.stopPropagation(); handleMenuOpen(e)}}>
        <MoreVerticalIcon fontSize="small" color="white" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: { backgroundColor: "var(--aux2-color)", color: "white",
              width: 220, border: "1px solid #374151", borderRadius: 2.5,
            },
          },
          list: { sx: { p: 0 } } }}>
        <MenuItem onClick={(e) => { e.stopPropagation(); onEdit(itemId);
            handleMenuClose();}}

          sx={{ display: "flex", gap: 1.5, px: 2, py: 1,
            "&:hover": { backgroundColor: "#2563eb" }}}>
          <Pen size={18} /> Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(itemId);
            handleMenuClose();
          }}
          sx={{ display: "flex", gap: 1.5, px: 2, py: 1,
            "&:hover": { backgroundColor: "#dc2626" }}}>
          <Trash size={18} /> Borrar
        </MenuItem>
      </Menu>
    </div>
  );
}





function FolderLabelWithMenu({icon: Icon, itemId, label, onEdit, onDelete}){
    const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);


  return (
    <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
      {Icon && <Icon style={{ marginRight: 8 }} />}
      <span style={{ flex: 1 }}>{label}</span>

      <IconButton size="small" onClick={handleMenuOpen}>
        <MoreVerticalIcon fontSize="small" color="white" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} onClick={(e) => e.stopPropagation()}>
        <MenuItem onClick={() => {  onEdit(itemId, label); handleMenuClose(); }}>
          Renombrar
        </MenuItem>
        <MenuItem onClick={() => { onDelete(itemId); handleMenuClose(); }}>
          Eliminar
        </MenuItem>

      </Menu>
    </div>
  );
}

function CustomLabel({ icon: Icon, expandable, children, ...other }) {
  return (
    <TreeItemLabel
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {Icon && (
        <Box
          component={Icon}
          className="labelIcon"
          color="inherit"
          sx={{ mr: 1, fontSize: '2.4rem' }}
        />
      )}

      <TreeItemLabelText variant="body2">{children}</TreeItemLabelText>
      {expandable && <DotIcon />}
    </TreeItemLabel>
  );
}


function FileExplorer() { 
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const {lastEvent, emitChange} = UseContextSearch();
  const [editFolder, setEditFolder] = useState(null); // { id, label }
  const navigate = useNavigate();
  useEffect(()=>{
    async function obtenerCarpetas() {
      const lista = await obtenerCarpetasWithContentByUser();
      
      if(!lista.length <= 0){
        
        setItems(lista)
      }
    }
    obtenerCarpetas()

  }, [])

  useEffect(() => {
    if (lastEvent?.type === "ENLACE_ELIMINADO") {
        const idEliminar = lastEvent.payload.id

        const newList = items.map(item => {
          // Si no tiene hijos, no cambiamos nada
          if (!item.children) return item;

          return {
            ...item,
            children: item.children.filter(child => child.id !== idEliminar)
          };
        });
        setItems(newList)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent]);



  const handleEditFileClick = (id) => {

    
    navigate(`/edit/${id}`);

  };



  const handleDeleteFile = async (idCarpeta)=>{
    const response= await eliminarEnlace(idCarpeta)
    if(response.ok){
      setItems((prev) =>
        prev.filter((item) =>
          item._id !== idCarpeta)
      );
    }
    emitChange({ type: "ENLACE_ELIMINADO", payload: { id: idCarpeta } });
  }

  const handleCreateFolder = (newCarpeta) => {
    
    const nuevaCarpeta ={

    id: newCarpeta._id,
    label: newCarpeta.nombre,
    children: [],
    fileType: 'folder'
  
    }
    setItems((prev) => [...prev, nuevaCarpeta]);

  };

  const handleEditFolderClick = (id, label) => {
    setEditFolder({ id, label });
    setOpen(true);
  };
  const handleEditFolder = (editedCarpeta) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === editedCarpeta._id
          ? { ...item, label: editedCarpeta.nombre }
          : item
      )
    );
  };

  const handleDeleteFolder = async (idCarpeta)=>{
    const response= await eliminarCarpeta(idCarpeta)

    if(response.ok){
      setItems((prev) =>
        prev.filter((item) =>
          item._id !== idCarpeta)
      );
    }

  }



  return (
    <Box
      sx={{display: 'flex', flexDirection: 'column', maxWidth: 250, gap: 1, paddingTop:0.2}}>
      <AddCarpetaModal
          open={open}
          onClose={() => setOpen(false)}
          existingCarpetas={items} // simula BD/local
          handleCreate={handleCreateFolder}
          handleEdit={handleEditFolder}
          editData={editFolder}
      />
      {/* Botón fijo arriba */}
      <Button
        variant="contained"
        size="small"
        style={{margin:"0 0.625rem" }}
        onClick={()=> {  setOpen(true)}}
      >
        Crear Carpeta
      </Button>
    <RichTreeView
      items={items}
      defaultExpandedItems={['1']}
      defaultSelectedItems=""
      sx={{ height: 'fit-content', flexGrow: 1, minWidth: 197, maxWidth: 197, minHeight:435, maxHeight:435, overflowY: 'auto' }}
      slots={{ item: (props) => (
        <CustomTreeItem {...props} 
        onEditFolder={handleEditFolderClick} onDeleteFolder={handleDeleteFolder} 
        onDeleteFile={handleDeleteFile} onEditFile={handleEditFileClick}/>
      )}}
      itemChildrenIndentation={24}
    />
    </Box>
  );
}

export default memo(FileExplorer);