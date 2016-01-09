package main

import (
	_ "daftar-buruan/routes"

	"os"

	"github.com/astaxie/beego"
)

func main() {
	beego.AddFuncMap("env", getEnv)
	beego.Run()
}

func getEnv(in string) (out string) {
	out = os.Getenv(in)
	return
}
