#include <iostream>
using namespace std;

#define L 1
#define R 20



int main(){

	for (int i = L ; i < R-L+1 ; i++){
		for (int j = L ; j < R-L+1 ; j++){
			cout<<(i^j)<<'\t';
		}
		cout<<endl;
	}

	return 0;
}
