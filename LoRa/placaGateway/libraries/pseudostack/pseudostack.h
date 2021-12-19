#define MAX_ELEM 50

struct node {
	int info;
	struct node *ptr;
}

*top, *top1, *temp, *aux;
int count = 0;

void create() {
	top = NULL;
}

void pop() {
	top1 = top;
	if (top1 != NULL) {
		top = top1->ptr;
		free(top);
		top=top1;
		count--;
	}
}

void push(int data) {
	if (top == NULL) {
		top =(struct node *)malloc(1*sizeof(struct node));
        	top->ptr = NULL;
        	top->info = data;
    	} else {
		if (count == MAX_ELEM) pop();
		temp =(struct node *)malloc(1*sizeof(struct node));
        	temp->ptr = top;
        	temp->info = data;
        	top = temp;
	} ++count;
}

bool exists(int data) {
	aux = top;
	while (aux != NULL) {
		if (aux->info == data) return true;
		aux = aux->ptr;
	}
	return false;
}
