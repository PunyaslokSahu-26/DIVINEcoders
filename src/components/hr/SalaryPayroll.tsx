
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Download, FileText, TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Mock data
const salaryData = [
  { 
    id: 1, 
    employee: "Rahul Gupta", 
    position: "Frontend Developer",
    department: "Engineering",
    baseSalary: 85000,
    bonus: 5000,
    benefits: 12000,
    totalCompensation: 102000,
    lastIncrement: "2023-06-15",
    incrementPercent: 5,
    image: "https://i.pravatar.cc/150?img=1"
  },
  { 
    id: 2, 
    employee: "Emily Johnson", 
    position: "Marketing Specialist",
    department: "Marketing",
    baseSalary: 75000,
    bonus: 3500,
    benefits: 10000,
    totalCompensation: 88500,
    lastIncrement: "2023-04-10",
    incrementPercent: 4,
    image: "https://i.pravatar.cc/150?img=5"
  },
  { 
    id: 3, 
    employee: "Sneha Patel", 
    position: "Product Manager",
    department: "Product",
    baseSalary: 95000,
    bonus: 8000,
    benefits: 15000,
    totalCompensation: 118000,
    lastIncrement: "2023-05-20",
    incrementPercent: 6,
    image: "https://i.pravatar.cc/150?img=9"
  },
  { 
    id: 4, 
    employee: "Priya Singh", 
    position: "UX Designer",
    department: "Design",
    baseSalary: 80000,
    bonus: 4000,
    benefits: 11000,
    totalCompensation: 95000,
    lastIncrement: "2023-03-15",
    incrementPercent: 3.5,
    image: "https://i.pravatar.cc/150?img=10"
  },
  { 
    id: 5, 
    employee: "Naveen Joshi", 
    position: "Backend Developer",
    department: "Engineering",
    baseSalary: 90000,
    bonus: 6000,
    benefits: 13000,
    totalCompensation: 109000,
    lastIncrement: "2023-07-01",
    incrementPercent: 5.5,
    image: "https://i.pravatar.cc/150?img=12"
  }
];

const incrementHistory = [
  { year: '2018', average: 3 },
  { year: '2019', average: 3.5 },
  { year: '2020', average: 2 },
  { year: '2021', average: 4 },
  { year: '2022', average: 5 },
  { year: '2023', average: 4.5 },
];

const departmentBudget = [
  { name: 'Engineering', budget: 520000 },
  { name: 'Marketing', budget: 380000 },
  { name: 'Product', budget: 420000 },
  { name: 'Design', budget: 320000 },
  { name: 'Operations', budget: 280000 },
];

const SalaryPayroll = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employeeHistory, setEmployeeHistory] = useState<any>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = salaryData.filter(emp => 
    emp.employee.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (employee: any) => {
    // Generate mock salary history for the selected employee
    const mockHistory = [
      { year: '2018', salary: Math.round(employee.baseSalary * 0.8) },
      { year: '2019', salary: Math.round(employee.baseSalary * 0.85) },
      { year: '2020', salary: Math.round(employee.baseSalary * 0.88) },
      { year: '2021', salary: Math.round(employee.baseSalary * 0.92) },
      { year: '2022', salary: Math.round(employee.baseSalary * 0.96) },
      { year: '2023', salary: employee.baseSalary },
    ];
    
    setSelectedEmployee(employee);
    setEmployeeHistory(mockHistory);
    setDialogOpen(true);
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "The payroll report has been generated and is ready for download.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Salary & Payroll</h2>
          <p className="text-muted-foreground">Manage employee compensation and benefits</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Salary Increment History</CardTitle>
            <CardDescription>Average annual increment percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={incrementHistory}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, 'Average Increment']} />
                <Legend />
                <Line type="monotone" dataKey="average" stroke="#2563EB" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Budget</CardTitle>
            <CardDescription>Annual salary budget by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={departmentBudget}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `$${value / 1000}k`} />
                <YAxis type="category" dataKey="name" />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Budget']} />
                <Bar dataKey="budget" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Employee Compensation</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <CardDescription>
            Detailed breakdown of employee salaries and benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Base Salary</TableHead>
                  <TableHead className="text-right">Total Comp.</TableHead>
                  <TableHead>Last Increment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={employee.image} alt={employee.employee} />
                            <AvatarFallback>{employee.employee.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.employee}</p>
                            <p className="text-sm text-muted-foreground">{employee.position}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${employee.baseSalary.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${employee.totalCompensation.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {employee.incrementPercent}%
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(employee.lastIncrement).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(employee)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No employees found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Employee Compensation Details</DialogTitle>
            <DialogDescription>
              Detailed breakdown of salary, benefits, and increment history.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="py-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedEmployee.image} alt={selectedEmployee.employee} />
                  <AvatarFallback>{selectedEmployee.employee.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedEmployee.employee}</h3>
                  <p className="text-sm text-muted-foreground">{selectedEmployee.position} • {selectedEmployee.department}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Compensation Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="py-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Base Salary</p>
                        <p className="text-lg font-bold">${selectedEmployee.baseSalary.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Annual Bonus</p>
                        <p className="text-lg font-bold">${selectedEmployee.bonus.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Benefits</p>
                        <p className="text-lg font-bold">${selectedEmployee.benefits.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Compensation</p>
                        <p className="text-lg font-bold text-primary">
                          ${selectedEmployee.totalCompensation.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Salary History</h4>
                    <Badge className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{selectedEmployee.incrementPercent}% Last Increase</span>
                    </Badge>
                  </div>
                  {employeeHistory && (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={employeeHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Salary']} />
                        <Bar dataKey="salary" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Benefits Details</h4>
                  <div className="text-sm p-3 bg-muted rounded-md space-y-1">
                    <p>• Health Insurance: ${Math.round(selectedEmployee.benefits * 0.5).toLocaleString()}</p>
                    <p>• Retirement Plan: ${Math.round(selectedEmployee.benefits * 0.3).toLocaleString()}</p>
                    <p>• Other Benefits: ${Math.round(selectedEmployee.benefits * 0.2).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
            <Button onClick={() => {
              toast({
                title: "Report Downloaded",
                description: "The detailed compensation report has been downloaded.",
              });
              setDialogOpen(false);
            }}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SalaryPayroll;
