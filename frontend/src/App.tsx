import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
function App() {
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/expenses/total-spent");
        const data = await response.json();
        if (response.ok) {
          setTotalSpent(data.totalSpent);
        } else {
          console.error("Failed to fetch total spent", data);
        }
      } catch (error) {
        console.error("Failed to fetch total spent", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total Spentt</CardTitle>
          <CardDescription>The total amount spent</CardDescription>
        </CardHeader>
        <CardContent>{totalSpent}</CardContent>
      </Card>
    </>
  );
}

export default App;
