import ast, operator
allowed_nodes = (
    ast.Expression,
    ast.BinOp,
    ast.Constant,
    ast.Add,
    ast.Sub,
    ast.Mult,
    ast.Div,
    ast.Pow,
    ast.Mod,
)

OPERATORS = {
ast.Add: operator.add,
ast.Sub: operator.sub,
ast.Mult: operator.mul,
ast.Div: operator.truediv,
ast.Pow: operator.pow,
ast.Mod: operator.mod,
}

def calculate(expression: str) -> str:
    """
    safely evaluate a mathematical expression.
     Args:
        expression: Mathematical expression.
    Returns:
        Result of the evaluated expression.
    """
    try:
        tree = ast.parse(
        expression,
        mode="eval"
    )
    except SyntaxError:
        raise ValueError(
            "Invalid mathematical expression."
        )
    
    # print(ast.dump(tree))
    
    def validate_node(node) -> None:
        if not isinstance(node, allowed_nodes):
            raise ValueError(
                f"Unsupported node: {type(node).__name__}"
            )
        for child in ast.iter_child_nodes(node):
            validate_node(child)

    def evaluate(node: ast.AST) -> float:
        if isinstance(node, ast.Expression):
            return evaluate(node.body)

        if isinstance(node, ast.Constant):
            if not isinstance(node.value, (int, float)):
                raise ValueError(
                    f"Unsupported constant: {type(node.value).__name__}"
                )
            return node.value

        if isinstance(node, ast.BinOp):
            left = evaluate(node.left)
            right = evaluate(node.right)
            operation = OPERATORS.get(type(node.op))

            if operation is None:
                raise ValueError(
                    f"Unsupported operator: {type(node.op).__name__}"
                )

            return operation(left, right)

        raise ValueError(
            f"Unsupported node: {type(node).__name__}"
        )

    validate_node(tree)
    return str(evaluate(tree))