import { ExternalLink } from 'lucide-react';
import React from 'react'
/**
 * 
 * @param {String[]} headers - Incluir solamente los nombre de columnas cuales tienen datos. `NO Helpers`
 * @returns 
 */
export default function Tabla({ headers = [], body = [], renderActions }) {
  if (headers.length === 0 || body.length === 0) return null;

  return (
    <div className="bg-[#252837] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <Thead dataTableHead={headers} hasActions={!!renderActions} />
          <Tbody body={body} renderActions={renderActions} headers={headers} />
        </table>
      </div>
    </div>
  );
}

function Thead({ dataTableHead, hasActions }) {
  return (
    <thead>
      <tr className="border-b border-gray-700">
        {dataTableHead.map((header, i) => (
          <th
            key={i}
            className="text-left text-gray-400 p-4"
            style={header.maxW ? { maxWidth: header.maxW } : {}}
          >
            {typeof header === "string" ? header : header.text}
          </th>
        ))}
        {hasActions && <th className="text-right text-gray-400 p-4">Acciones</th>}
      </tr>
    </thead>
  );
}


function Tbody({ body, renderActions, headers }) {
  return (
    <tbody>
      {body.map((row) => (
        <tr key={row.id} className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
            
          {row.dataRow.map((cell, colIndex) => {
            const headerMaxW = headers[colIndex]?.maxW;
            return trowItem({ ...cell, maxWColumn: headerMaxW });
          })}
          {renderActions && (
            <td className="text-right p-4">{renderActions(row)}</td>
          )}
        </tr>
      ))}
    </tbody>
  );
}

function trowItem(label) {
  const style = label.maxWColumn
    ? { maxWidth: label.maxWColumn, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
    : {};

  // 🟢 1. Lista redondeada
  if (label.isRoundedList && Array.isArray(label.text)) {
    let colorRounded = "";
    switch (label.color) {
      case "verde": colorRounded = "bg-green-500/20 text-green-400"; break;
      case "rojo": colorRounded = "bg-red-500/20 text-red-400"; break;
      case "azul": colorRounded = "bg-blue-500/20 text-blue-400"; break;
      case "morado": colorRounded = "bg-purple-500/20 text-purple-400"; break;
      default: colorRounded = "bg-zinc-500/20 text-zinc-400"; break;
    }

    return (
      <td className="p-4 text-white" style={style}>
        <div className="flex flex-wrap gap-2">
          {label.text.map((tag, i) => (
            <span key={i} className={`px-3 py-1 rounded-full text-sm ${colorRounded}`}>
              {tag}
            </span>
          ))}
        </div>
      </td>
    );
  }

  // 🟢 2. Texto redondeado
  if (label.isRounded) {
    let colorRounded = "";
    switch (label.color) {
      case "verde": colorRounded = "bg-green-500/20 text-green-400"; break;
      case "rojo": colorRounded = "text-red-400"; break;
      default:
        if (label.text.toLowerCase() === "activo") colorRounded = "bg-green-500/20 text-green-400";
        else if (label.text.toLowerCase() === "inactivo") colorRounded = "bg-red-500/20 text-red-400";
        else if (label.text.toLowerCase() === "inteligente") colorRounded = "bg-blue-500/20 text-blue-400";
        else if (label.text.toLowerCase() === "preciso") colorRounded = "bg-purple-500/20 text-purple-400";
        else if (label.text.toLowerCase() === "ninguno") colorRounded = "bg-zinc-500/20 text-zinc-400";
        else colorRounded = "bg-gray-500/20 text-gray-400";
    }

    return (
      <td className="p-4" style={style}>
        <span className={`px-3 py-1 rounded-full text-sm ${colorRounded}`}>
          {label.text}
        </span>
      </td>
    );
  }

  // 🔵 3. URLs
  if (typeof label.text === "string" && label.text.startsWith("http")) {
    return (
      <td className="p-4 text-white" style={style}>
        <a
          href={label.text}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 truncate"
        >
          {label.text}
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      </td>
    );
  }

  // ⚪ 4. Texto simple
  return (
    <td className="p-4 text-white" style={style}>
      {label.text}
    </td>
  );
}
