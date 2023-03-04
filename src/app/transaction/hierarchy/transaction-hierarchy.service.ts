import { Injectable } from '@angular/core';
import { TransactionHierarchyEntry, TransactionHierarchyNode } from '../model';

@Injectable({
	providedIn: 'root'
})
export class TransactionHierarchyService {
	create(entries: TransactionHierarchyEntry[]): TransactionHierarchyNode[] {
		const tree = this.treeify(entries);
		this.traverse(tree, x => x.level = x.parent ? x.parent.level + 1 : 0);
		const list = this.flaten(tree);
		this.markNonLastSiblings(list);
		this.setNodeBoxes(list);
		return list;
	}

	getMaxLevel(nodes: TransactionHierarchyNode[]): number {
		return nodes.reduce((a, b) => Math.max(a, b.level), 0);
	}

	private treeify(arr: TransactionHierarchyEntry[]): TransactionHierarchyNode[] {
		const tree: TransactionHierarchyNode[] = [];
		const entries = arr.map(x => new TransactionHierarchyNode(x));
		const lookup: {[key: string]: any} = {};
		entries.forEach(x => lookup[`${x.entry.ID}`] = x);
		entries.forEach(child => {
			if (child.entry.PARENT_ID) {
				const parent = <TransactionHierarchyNode>lookup[`${child.entry.PARENT_ID}`];
				parent.addChild(child);
			}
			else {
				tree.push(child);
			}
		});
		return tree;
	}

	private setNodeBoxes(nodes: TransactionHierarchyNode[]): void {
		const maxLevel = this.getMaxLevel(nodes);
		nodes.forEach(x => x.boxes = this.getBoxes(x, maxLevel));
	}

	private getBoxes(node: TransactionHierarchyNode, maxLevel: number): string[] {
		const a: string[] = [node.entry.AMOUNT_TYPE === 0 ? '1' : '2']; //  ☐ ■
		if (node.parent) {
			let x = node.last ? '3' : '4'; //  ┗ ┣
			a.unshift(x);
			let n = node.parent;
			while (n.parent) {
				x = n.last ? '' : '5'; // ┃
				a.unshift(x);
				n = n.parent;
			}
		}
		for (let i = a.length; i <= maxLevel; i++) {
			a.push('');
		}
		return a;
	}

	private markNonLastSiblings(nodes: TransactionHierarchyNode[]): void {
		nodes.forEach(x => {
			x.children.slice(0, -1).forEach(c => c.last = false);
		});
	}

	private flaten(nodes: TransactionHierarchyNode[]): TransactionHierarchyNode[] {
		const list: TransactionHierarchyNode[] = [];
		this.traverse(nodes, x => list.push(x));
		return list;
	}

	private traverse(nodes: TransactionHierarchyNode[], action: (x: TransactionHierarchyNode) => void): void {
		nodes.forEach(node => {
			action(node);
			if (node.children.length) {
				this.traverse(node.children, action);
			}
		});
	}
}
