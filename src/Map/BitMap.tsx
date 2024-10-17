import React, { useState, useEffect } from "react";

// Size of Grid Map
const BitMap: React.FC = () => {
  const rows: number = 24; // Number of rows in the grid
  const cols: number = 24; // Number of columns in the grid

  // Initialize state for the grid map
  const [array2dMap, setArray2dMap] = useState<number[][]>([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 }); // Player's starting position

  // Function to create the initial grid map
  const createGridMap = () => {
    const initialMap: number[][] = [];

    // Creation of Grid Map
    for (let x = 0; x < rows; x++) {
      initialMap[x] = [];
      for (let y = 0; y < cols; y++) {
        initialMap[x][y] = 0; // Initialize all values to 0 (ground)
      }
    }

    // Fill the borders with 1 (walls)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
          initialMap[r][c] = 1; // Set the border tiles to 1 (walls)
        }
      }
    }

    return initialMap;
  };

  // Use useEffect to set the initial grid map when the component mounts
  useEffect(() => {
    const initialMap = createGridMap();
    setArray2dMap(initialMap);
  }, []); // Empty dependency array means this runs once after the initial render

  // Define the TileMap class with tile properties
  class TileMap {
    public static tiles: {
      [key: number]: { type: string; color: string; isWalkable: boolean };
    } = {
      0: { type: "ground", color: "green", isWalkable: true }, // Tile 0 properties
      1: { type: "wall", color: "red", isWalkable: false }, // Tile 1 properties
    };
  }

  // Function to move the player
  const movePlayer = (dx: number, dy: number) => {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    // Check if the new position is walkable
    if (array2dMap[newX] && array2dMap[newX][newY] !== undefined) {
      const tileType = array2dMap[newX][newY];
      if (TileMap.tiles[tileType].isWalkable) {
        setPlayerPosition({ x: newX, y: newY });
      }
    }
  };

  // Handle keyboard events for movement
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          movePlayer(-1, 0);
          break;
        case "s":
          movePlayer(1, 0);
          break;
        case "a":
          movePlayer(0, -1);
          break;
        case "d":
          movePlayer(0, 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerPosition, array2dMap]); // Add dependencies

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 50px)` }}
    >
      {array2dMap.map((row, rowIndex) =>
        row.map((tileValue, colIndex) => {
          const tileProperties = TileMap.tiles[tileValue];
          const isPlayer =
            playerPosition.x === rowIndex && playerPosition.y === colIndex;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: isPlayer ? "blue" : tileProperties.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid black",
              }}
            >
              {tileValue}
            </div>
          );
        })
      )}
    </div>
  );
};

export default BitMap;
