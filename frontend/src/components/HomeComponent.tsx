"use client";
import {useEffect, useState} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactMarkdown from 'react-markdown';
import {CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {JSX, SVGProps} from "react";
import {QueryResultTable} from "@/components/QueryResultTable";
import {Data} from "@/types";
import {useRouter} from 'next/navigation';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-sqlserver"; // Thème clair
export default function HomeComponent() {
    const [sqlQuery, setSqlQuery] = useState("");
    const [isValidQuery, setValidationResult] = useState(false);
    const [queryResult, setQueryResult] = useState<Data | null>(null);
    const [streamData, setStreamData] = useState([] as string[]);
    const router = useRouter();

    useEffect(() => {
        const username = localStorage.getItem("username");
        const host = localStorage.getItem("host");
        const password = localStorage.getItem("password");

        if (!username || !host || !password) {
            router.push("/landing")
        }
    }, []);
    const backendUrl = "http://localhost:5000";


    useEffect(() => {
        const eventSource = new EventSource(backendUrl + "/stream-optimization");
        eventSource.onmessage = (event: MessageEvent<string>) => {
            console.log(event)
            setStreamData(prevData => [...prevData, event.data]);
        };

        return () => {
            eventSource.close();
        };
    }, []);
    const handleChangeDatabase = () => {
        // Supprimer les informations de localStorage
        localStorage.removeItem("username");
        localStorage.removeItem("host");
        localStorage.removeItem("password");

        // Naviguer vers la page de connexion
        router.push("/connect");
    };  


    const validateQuery = async () => {
        toast.promise(fetch(backendUrl + '/ValidateSQL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({query: sqlQuery})
        }).then(response => response.json()), {
            success: "Valid SQL Query",
            error: "Invalid SQL Query",
            pending: "Validating SQL Query..."
        }).then(data => {
            if (data.success === true) {
                console.log(data.result);
                setValidationResult(true);
            } else {
                setValidationResult(false);
            }
        });
    };
        // Fonction pour obtenir le plan d'exécution
        const fetchExecutionPlan = async () => {
            try {
                const response = await fetch(backendUrl + '/ExecutionPlan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: sqlQuery,
                        username: localStorage.getItem("username"),
                        host: localStorage.getItem("host"),
                        password: localStorage.getItem("password")
                    })
                });
                const data = await response.json();
                const executionPlan = JSON.parse(data.execution_plan);
                return executionPlan;
            } catch (error) {
                console.error('Error fetching execution plan:', error);
                return null;
            }
        };
    
        // Fonction pour afficher le plan d'exécution dans une pop-up
        const showExecutionPlan = async () => {
            const executionPlan = await fetchExecutionPlan();
            if (executionPlan) {
                console.log(executionPlan);
                toast(JSON.stringify(executionPlan), {
                    position: "bottom-center",
                    style: {
                        width: "100%", // Largeur de la pop-up  
                        maxWidth: "800px", // Largeur maximale de la pop-up
                        textAlign: "center" // Alignement du texte au centre
                    }
                });
            } else {
                toast.error("Error fetching execution plan");
            }
        };

    async function executeQuery() {
        toast.promise(fetch(backendUrl + '/ExecuteQuery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: sqlQuery,
                username: localStorage.getItem("username"),
                host: localStorage.getItem("host"),
                password: localStorage.getItem("password")
            })
        }).then(response => response.json()), {
            success: "Query executed successfully!",
            error: "Error executing query",
            pending: "Executing query..."
        }).then(data => {
            if (data.result) {
                setQueryResult(data);
            }
        });
    }

    return (
        
        <div className={"w-screen mx-10 flex flex-col gap-2"}>
            
            <div className='flex justify-between items-center'>
    <div className="flex items-center">
        <DatabaseIcon className="w-10 h-10 mr-2 text-red-500"/>
        <span className="text-lg font-bold">BetterSQL</span>
    </div>
    <Button className="bg-red-500" onClick={handleChangeDatabase}>Change Database</Button>
</div>
            
            <Card className="bg-white">
                <CardHeader className="flex items-center justify-center">
                    {/* <DatabaseIcon className="w-10 h-10 mr-2 text-red-500"/> */}
                    <div>
                        <ToastContainer/>
                        <CardTitle className="text-lg text-center">Query Optimizer</CardTitle>
                        <CardDescription className="text-center">Enter your SQL query below to optimize
                            it.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex gap-4 pt-4">
                    <div className="grid gap-1.5 w-full">
                        <Label htmlFor="sql">SQL Query</Label>
                        <AceEditor
                                    mode="sql"
                                    theme="sqlserver"
                                    value={sqlQuery}
                                    onChange={(value) => setSqlQuery(value)}
                                    name="sql-editor"
                                    placeholder="Enter your SQL query here."
                                    width="100%"
                                    height="200px"
                                    fontSize={16}
                                    showPrintMargin={true}
                                    showGutter={true}
                                    highlightActiveLine={false}
                                    setOptions={{
                                        enableBasicAutocompletion: false,
                                        enableLiveAutocompletion: false,
                                        enableSnippets: false,
                                        showLineNumbers: true,
                                        tabSize: 2,
                                    }}
                                    />
                    </div>
                    
                    <div className="grid gap-1.5 w-full">
                        <Label htmlFor="optimized">Optimized</Label>
                        
                        <ReactMarkdown>
                        {streamData.join("\n")}
                            {/* This is a paragraph of text. You can **bold** text, *italicize* text, or create [links](https://www.example.com). */}
                     </ReactMarkdown> 
                {/* todo: add optimized query here */}
                    </div>
                </CardContent>
                <CardFooter className="flex gap-4">
                    <Button disabled={!sqlQuery} className="bg-green-500" onClick={validateQuery}>Validate
                        Syntax</Button>
                    <Button disabled={!isValidQuery} className="bg-blue-500" onClick={executeQuery}>Execute
                        Query </Button>
                        <Button disabled={!isValidQuery} className="bg-orange-500" onClick={showExecutionPlan} >
                        Execution Plan
                        </Button>
                </CardFooter>
            </Card>
            <Card className="bg-white">
                <CardHeader className="flex items-center justify-center">
                    <CardTitle className="text-lg text-center">Query Result</CardTitle>
                </CardHeader>
                <CardContent>
                    {queryResult?.result && <QueryResultTable result={queryResult.result}/>}
                </CardContent>
            </Card>
        </div>
    )
}

function DatabaseIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <ellipse cx="12" cy="5" rx="9" ry="3"/>
            <path d="M3 5V19A9 3 0 0 0 21 19V5"/>
            <path d="M3 12A9 3 0 0 0 21 12"/>
        </svg>
    )
}
