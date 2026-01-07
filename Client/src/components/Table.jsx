import React from "react";

const Table = ({ data, onRowClick, actions }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-600 p-5">No data available</p>;
  }

  const headers = Object.keys(data[0]);

  return (
    <table className="w-full border-collapse mt-5 bg-white shadow-md rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-100">
          {headers.map((header) => (
            <th
              key={header}
              className="p-4 text-left border-b-2 border-gray-300 font-semibold text-gray-700 text-sm uppercase tracking-wide"
            >
              {header}
            </th>
          ))}
          {actions && (
            <th className="p-4 text-center border-b-2 border-gray-300 font-semibold text-gray-700 text-sm uppercase tracking-wide">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            className={`border-b border-gray-200 transition-colors hover:bg-gray-100 ${
              onRowClick ? "cursor-pointer" : ""
            }`}
          >
            {headers.map((header) => (
              <td
                key={header}
                className="p-3.5 text-gray-800 text-sm"
                onClick={() => onRowClick && onRowClick(row, index)}
              >
                {row[header]}
              </td>
            ))}
            {actions && (
              <td className="p-3.5 text-center">
                <div className="flex gap-2 justify-center">
                  {actions(row, index)}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
