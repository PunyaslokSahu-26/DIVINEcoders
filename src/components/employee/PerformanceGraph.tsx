import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PerformanceGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          Performance chart will be implemented here
        </div>
      </CardContent>
    </Card>
  );
} 