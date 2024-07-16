import "@theme-toggles/react/css/Classic.css"
import { Classic } from "@theme-toggles/react"

interface ThemeToggleProps {
  onToggle: () => void;
  darkMode: boolean;
}

export default function ThemeToggle(props: ThemeToggleProps){
  return (
      <div className="w-full flex justify-end p-4">
        {/*Wrap the Classic component in a div to avoid overriding its existing onClick functionality*/}
        <div onClick={props.onToggle}>
          <Classic duration={500} className={`text-5xl ${props.darkMode ? "text-white" : "text-gray-800"}`}/>
        </div>
      </div>
  )
}