import { useState } from "preact/hooks";

const PasswordInputIsland = ({ setPassword }: { setPassword: (password: string) => void }) => {
  const [password, setPasswordState] = useState("");

  const handleChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      setPasswordState(e.target.value);
      setPassword(e.target.value);
    }
  };

  return (
    <input
      id="password"
      name="password"
      type="password"
      required
      class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
      onChange={handleChange}
      value={password}
    />
  );
};

export default PasswordInputIsland;